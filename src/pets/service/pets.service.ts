import {Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Pet, Prisma } from '@prisma/client';
import { PetsRepository } from '../repository/pets.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreatePetDto, authUserId?: number): Promise<Pet> {
    let finalUserId: number | undefined = undefined;

    if (dto.userId !== undefined && dto.userId !== null) {
      finalUserId = dto.userId;
      if (authUserId && finalUserId !== authUserId) {
        throw new ForbiddenException('Cannot create pet for another user.');
      }
    } else if (authUserId) {
      finalUserId = authUserId;
    }

    if (finalUserId) {
      const user = await this.usersRepository.findById(finalUserId);
      if (!user) throw new NotFoundException(`User with id ${finalUserId} not found`);
    }

    const data: Prisma.PetCreateInput = {
      name: dto.name,
      age: dto.age,
      type: dto.type,
      race: dto.race ?? undefined,
      currentWeight:
        dto.currentWeight !== undefined && dto.currentWeight !== null
          ? new Prisma.Decimal(dto.currentWeight)
          : undefined,
      urlPhoto: dto.urlPhoto ?? undefined,
      status: dto.status ?? undefined,
      registrationDate: new Date(dto.registrationDate),
      user: finalUserId ? { connect: { id: finalUserId } } : undefined,
    };

    return this.petsRepository.create(data);
  }

  async assignPetToUser(
    petId: number,
    userId: number,
    authUserId?: number,
  ): Promise<Pet> {
    const pet = await this.petsRepository.findById(petId);
    if (!pet) throw new NotFoundException(`Pet with id ${petId} not found`);

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    if (pet.userId && pet.userId !== userId) {
      throw new BadRequestException('Pet already assigned to another user');
    }

    if (authUserId && userId !== authUserId) {
      throw new ForbiddenException('Cannot assign pet to another user.');
    }

    return this.petsRepository.assignToUser(petId, userId);
  }

  async getPetsByUser(userId: number, authUserId?: number): Promise<Pet[]> {
    if (authUserId && userId !== authUserId) {
      throw new ForbiddenException('Cannot list pets for another user.');
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return this.petsRepository.findByUserId(userId);
  }

  async getPet(id: number, authUserId?: number): Promise<Pet> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);

    if (authUserId && pet.userId && pet.userId !== authUserId) {
      throw new ForbiddenException('Not authorized to view this pet.');
    }

    return pet;
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.findAll();
  }

  async update(id: number, dto: UpdatePetDto, authUserId?: number): Promise<Pet> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);

    if (authUserId && pet.userId && pet.userId !== authUserId) {
      throw new ForbiddenException('Not authorized to update this pet.');
    }

    const data: Prisma.PetUpdateInput = {
      name: dto.name ?? undefined,
      age: dto.age ?? undefined,
      type: dto.type ?? undefined,
      race: dto.race ?? undefined,
      currentWeight:
        dto.currentWeight !== undefined && dto.currentWeight !== null
          ? new Prisma.Decimal(dto.currentWeight)
          : undefined,
      urlPhoto: dto.urlPhoto ?? undefined,
      status: dto.status ?? undefined,
      registrationDate: dto.registrationDate ? new Date(dto.registrationDate) : undefined,
    };

    return this.petsRepository.update(id, data);
  }

  async remove(id: number, authUserId?: number): Promise<Pet> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);

    if (authUserId && pet.userId && pet.userId !== authUserId) {
      throw new ForbiddenException('Not authorized to remove this pet.');
    }

    return this.petsRepository.delete(id);
  }
}
