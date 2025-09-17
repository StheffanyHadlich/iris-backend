import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, Adopter } from '@prisma/client';
import { CreateAdopterDto } from '../dto/create-adopter.dto';
import { UpdateAdopterDto } from '../dto/update-adopter.dto';

@Injectable()
export class AdopterService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdopterDto): Promise<Adopter> {
    const data: Prisma.AdopterCreateInput = {
      name: dto.name,
      email: dto.email,
      telephone: dto.telephone,
      address: dto.address,
    };

    return this.prisma.adopter.create({ data });
  }

  async findAll(): Promise<Adopter[]> {
    return this.prisma.adopter.findMany();
  }

  async findOne(id: number): Promise<Adopter | null> {
    return this.prisma.adopter.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateAdopterDto): Promise<Adopter> {
    const data: Prisma.AdopterUpdateInput = {
      name: dto.name,
      email: dto.email,
      telephone: dto.telephone,
      address: dto.address,
    };

    return this.prisma.adopter.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Adopter> {
    return this.prisma.adopter.delete({ where: { id } });
  }
}
