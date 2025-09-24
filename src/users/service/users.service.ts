import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(data: CreateUserDto) {
    const exists = await this.usersRepository.findByEmail(data.email);
    if (exists) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.usersRepository.create({
      username: data.username,
      email: data.email,
      password: hashed,
    });

    const { password, ...safe } = user;
    return safe;
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: number, data: UpdateUserDto) {
    const payload: Prisma.UserUpdateInput = { ...data };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password as string, 10);
    }

    const user = await this.usersRepository.update(id, payload);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: number) {
    await this.usersRepository.remove(id);
    return { removed: true };
  }
}
