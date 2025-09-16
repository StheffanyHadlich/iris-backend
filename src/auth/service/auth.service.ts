import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(pass, user.password || '');
    if (!valid) return null;

    const { password, ...safe } = user;
    return safe;
  }

  async login (user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register (dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.login(user);
  }
}
