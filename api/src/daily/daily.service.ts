import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Daily } from '@prisma/client';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';

@Injectable()
export class DailyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDailyDto): Promise<Daily> {
    const data: Prisma.DailyCreateInput = {
      dailyDate: new Date(dto.dailyDate),
      weight: dto.weight ? new Prisma.Decimal(dto.weight) : undefined,
      notes: dto.notes,
      prescriptionNotes: dto.prescriptionNotes,
      pet: { connect: { id: dto.petId } },
    };

    return this.prisma.daily.create({ data });
  }

  async findAll(): Promise<Daily[]> {
    return this.prisma.daily.findMany();
  }

  async findOne(id: number): Promise<Daily | null> {
    return this.prisma.daily.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateDailyDto): Promise<Daily> {
    const data: Prisma.DailyUpdateInput = {
      dailyDate: dto.dailyDate ? new Date(dto.dailyDate) : undefined,
      weight: dto.weight ? new Prisma.Decimal(dto.weight) : undefined,
      notes: dto.notes,
      prescriptionNotes: dto.prescriptionNotes,
      pet: dto.petId ? { connect: { id: dto.petId } } : undefined,
    };

    return this.prisma.daily.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Daily> {
    return this.prisma.daily.delete({ where: { id } });
  }
}
