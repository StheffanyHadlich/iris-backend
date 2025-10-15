import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DiaryRepository } from '../repository/diary.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { PetsRepository } from '../../pets/repository/pets.repository';
import { CreateDiaryDto } from '../dto/create-daily.dto';
import { Daily } from '@prisma/client';

@Injectable()
export class DiaryService {
  constructor(
    private readonly diaryRepo: DiaryRepository,
    private readonly petsRepo: PetsRepository,
  ) {}

  async create(petId: number, dto: CreateDiaryDto, authUserId: number): Promise<Daily> {
    const pet = await this.petsRepo.findById(petId);
    if (!pet) throw new NotFoundException(`Pet ${petId} not found`);
    if (!pet.userId || pet.userId !== authUserId) throw new ForbiddenException('Not owner of the pet');

    const data = {
      pet: { connect: { id: petId } },
      dailyDate: new Date(dto.date),
      notes: dto.description,
    };

    return this.diaryRepo.create(data as any);
  }

  async list(petId: number, authUserId: number): Promise<Daily[]> {
    const pet = await this.petsRepo.findById(petId);
    if (!pet) throw new NotFoundException(`Pet ${petId} not found`);
    if (!pet.userId || pet.userId !== authUserId) throw new ForbiddenException('Not owner of the pet');

    return this.diaryRepo.findByPetId(petId);
  }
}
