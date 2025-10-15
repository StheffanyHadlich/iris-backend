import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Daily, Prisma } from '@prisma/client';

@Injectable()
export class DiaryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DailyCreateInput): Promise<Daily> {
    return this.prisma.daily.create({ data });
  }

  async findByPetId(petId: number): Promise<Daily[]> {
    return this.prisma.daily.findMany({
      where: { petId },
      orderBy: { dailyDate: 'desc' },
    });
  }
}
