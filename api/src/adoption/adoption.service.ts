import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Adoption } from '@prisma/client';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Injectable()
export class AdoptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdoptionDto): Promise<Adoption> {
    const data: Prisma.AdoptionCreateInput = {
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: dto.status,
      adopter: { connect: { id: dto.adopterId } },
      pet: { connect: { id: dto.petId } },
    };

    return this.prisma.adoption.create({ data });
  }

  async findAll(): Promise<Adoption[]> {
    return this.prisma.adoption.findMany();
  }

  async findOne(id: number): Promise<Adoption | null> {
    return this.prisma.adoption.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateAdoptionDto): Promise<Adoption> {
    const data: Prisma.AdoptionUpdateInput = {
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: dto.status,
      adopter: dto.adopterId ? { connect: { id: dto.adopterId } } : undefined,
      pet: dto.petId ? { connect: { id: dto.petId } } : undefined,
    };

    return this.prisma.adoption.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Adoption> {
    return this.prisma.adoption.delete({ where: { id } });
  }
}
