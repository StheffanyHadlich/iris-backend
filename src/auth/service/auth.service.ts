import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshTokenTtlMs: number;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenRepo: RefreshTokenRepository,
    private configService: ConfigService,
  ) {
    const ttlString = this.configService.get<string>('REFRESH_TOKEN_TTL');
    this.refreshTokenTtlMs = ms(ttlString);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(pass, user.password || '');
    if (!valid) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = await this.createRefreshTokenForUser(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.login(user);
  }

  private async createRefreshTokenForUser(userId: number): Promise<string> {
    const secret = randomBytes(64).toString('hex'); 
    const hashed = await bcrypt.hash(secret, 12); 

    const expiresAt = new Date(Date.now() + this.refreshTokenTtlMs);

    const record = await this.refreshTokenRepo.create({
      token: hashed,
      user: { connect: { id: userId } },
      expiresAt,
      revoked: false,
    } as any);

    return `${record.id}.${secret}`;
  }

  async refresh(refreshTokenString: string) {
    if (!refreshTokenString) throw new UnauthorizedException('Refresh token missing');

    const parts = refreshTokenString.split('.');
    if (parts.length !== 2) throw new UnauthorizedException('Invalid refresh token format');

    const id = Number(parts[0]);
    const secret = parts[1];

    if (isNaN(id)) throw new UnauthorizedException('Invalid refresh token ID');

    const record = await this.refreshTokenRepo.findById(id);
    if (!record) throw new UnauthorizedException('Refresh token not found');

    if (record.revoked) throw new UnauthorizedException('Refresh token revoked');
    if (record.expiresAt < new Date()) throw new UnauthorizedException('Refresh token expired');

    const matches = await bcrypt.compare(secret, record.token);
    if (!matches) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.findById(record.userId);
    if (!user) throw new UnauthorizedException('User not found');

    await this.refreshTokenRepo.revoke(record.id);

    return this.login({ ...user, password: undefined } as Omit<User, 'password'>);
  }

  async logout(refreshTokenString: string) {
    if (!refreshTokenString) return;

    const parts = refreshTokenString.split('.');
    if (parts.length !== 2) return;

    const id = Number(parts[0]);
    if (isNaN(id)) return;

    const record = await this.refreshTokenRepo.findById(id);
    if (!record) return;

    await this.refreshTokenRepo.revoke(id);
    this.logger.log(`Refresh token ${id} revoked successfully`);
  }
}
