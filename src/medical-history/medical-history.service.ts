import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, MedicalHistory } from '@prisma/client';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Injectable()
export class MedicalHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalHistoryDto): Promise<MedicalHistory> {
    const data: Prisma.MedicalHistoryCreateInput = {
      medicalDate: new Date(dto.medicalDate),
      veterinarian: dto.veterinarian,
      diagnosis: dto.diagnosis,
      treatment: dto.treatment,
      prescription: dto.prescription,
      pet: { connect: { id: dto.petId } },
    };

    return this.prisma.medicalHistory.create({ data });
  }

  async findAll(): Promise<MedicalHistory[]> {
    return this.prisma.medicalHistory.findMany();
  }

  async findOne(id: number): Promise<MedicalHistory | null> {
    return this.prisma.medicalHistory.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateMedicalHistoryDto): Promise<MedicalHistory> {
    const data: Prisma.MedicalHistoryUpdateInput = {
      medicalDate: dto.medicalDate ? new Date(dto.medicalDate) : undefined,
      veterinarian: dto.veterinarian,
      diagnosis: dto.diagnosis,
      treatment: dto.treatment,
      prescription: dto.prescription,
      pet: dto.petId ? { connect: { id: dto.petId } } : undefined,
    };

    return this.prisma.medicalHistory.update({ where: { id }, data });
  }

  async remove(id: number): Promise<MedicalHistory> {
    return this.prisma.medicalHistory.delete({ where: { id } });
  }
}
