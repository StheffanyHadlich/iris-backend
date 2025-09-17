import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Pet } from '@prisma/client';

@Injectable()
export class PetsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PetCreateInput): Promise<Pet> {
    return this.prisma.pet.create({ data });
  }

  async findById(id: number): Promise<Pet | null> {
    return this.prisma.pet.findUnique({ where: { id } });
  }

  async findAll(): Promise<Pet[]> {
    return this.prisma.pet.findMany();
  }

  async findByUserId(userId: number): Promise<Pet[]> {
    return this.prisma.pet.findMany({ where: { userId } });
  }

  async update(id: number, data: Prisma.PetUpdateInput): Promise<Pet> {
    return this.prisma.pet.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Pet> {
    return this.prisma.pet.delete({ where: { id } });
  }

  async assignToUser(petId: number, userId: number): Promise<Pet> {
    return this.prisma.pet.update({
      where: { id: petId },
      data: { userId },
    });
  }
}
