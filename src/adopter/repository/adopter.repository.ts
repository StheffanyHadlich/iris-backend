import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Adopter, Prisma } from '@prisma/client';

@Injectable()
export class AdopterRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AdopterCreateInput): Promise<Adopter> {
    return this.prisma.adopter.create({ data });
  }

  async findAll(): Promise<Adopter[]> {
    return this.prisma.adopter.findMany();
  }

  async findById(id: number): Promise<Adopter | null> {
    return this.prisma.adopter.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.AdopterUpdateInput): Promise<Adopter> {
    return this.prisma.adopter.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Adopter> {
    return this.prisma.adopter.delete({ where: { id } });
  }
}
