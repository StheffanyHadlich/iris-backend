import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Pet } from '@prisma/client';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Pet[]> {
    return this.prisma.pet.findMany();
  }

  async findOne(id: number): Promise<Pet | null> {
    return this.prisma.pet.findUnique({
      where: { id },
    });
  }

  async create(dto: CreatePetDto): Promise<Pet> {
    const data: Prisma.PetCreateInput = {
      name: dto.name,
      age: dto.age,
      type: dto.type,
      race: dto.race,
      currentWeight: dto.currentWeight
        ? new Prisma.Decimal(dto.currentWeight)
        : undefined,
      urlPhoto: dto.urlPhoto,
      status: dto.status ?? 'AVAILABLE',
      registrationDate: new Date(dto.registrationDate),
    };

    return this.prisma.pet.create({ data });
  }

  async update(id: number, dto: UpdatePetDto): Promise<Pet> {
    const data: Prisma.PetUpdateInput = {
      name: dto.name,
      age: dto.age,
      type: dto.type,
      race: dto.race,
      currentWeight: dto.currentWeight
        ? new Prisma.Decimal(dto.currentWeight)
        : undefined,
      urlPhoto: dto.urlPhoto,
      status: dto.status,
      registrationDate: dto.registrationDate
        ? new Date(dto.registrationDate)
        : undefined,
    };

    return this.prisma.pet.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Pet> {
    return this.prisma.pet.delete({ where: { id } });
  }
}
