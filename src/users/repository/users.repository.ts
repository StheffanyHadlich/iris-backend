import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<Partial<User>[]> {
    return this.prisma.user.findMany({
      select: { id: true, username: true, email: true, createdAt: true },
    });
  }

  async findOne(id: number): Promise<Partial<User> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, createdAt: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findWithPets(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { pets: true },
    });
  }


  async update(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<Partial<User>> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, createdAt: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
