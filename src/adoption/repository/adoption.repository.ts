import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Adoption, Prisma } from '@prisma/client';

@Injectable()
export class AdoptionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AdoptionCreateInput): Promise<Adoption> {
    return this.prisma.adoption.create({ data });
  }

  async findAll(): Promise<Adoption[]> {
    return this.prisma.adoption.findMany({
      include: { pet: true, adopter: true },
    });
  }

  async findById(id: number): Promise<Adoption | null> {
    return this.prisma.adoption.findUnique({
      where: { id },
      include: { pet: true, adopter: true },
    });
  }

  async findByPetId(petId: number): Promise<Adoption | null> {
    return this.prisma.adoption.findFirst({ where: { petId } });
  }

  async update(id: number, data: Prisma.AdoptionUpdateInput): Promise<Adoption> {
    return this.prisma.adoption.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Adoption> {
    return this.prisma.adoption.delete({ where: { id } });
  }
}
