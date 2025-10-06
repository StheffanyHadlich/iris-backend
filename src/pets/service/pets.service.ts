import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Pet, PetSex, PetStatus, Prisma } from '@prisma/client';
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

async create(dto: CreatePetDto, authUserId: number): Promise<Pet> {
  const user = await this.usersRepository.findById(authUserId);
  if (!user) throw new NotFoundException(`User with id ${authUserId} not found`);

  const data: Prisma.PetCreateInput = {
    name: dto.name,
    species: dto.species,
    breed: dto.breed ?? undefined,
    color: dto.color ?? undefined,
    sex: dto.sex ?? PetSex.UNKNOWN,
    castrated: dto.castrated ?? false,
    urlPhoto: dto.urlPhoto ?? undefined,
    status: dto.status ?? PetStatus.AVAILABLE,
    registrationDate: new Date(dto.registrationDate),
    dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    user: { connect: { id: authUserId } },
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

    const data: Prisma.PetUpdateInput = {
      name: dto.name ?? undefined,
      species: dto.species ?? undefined,
      breed: dto.breed ?? undefined,
      color: dto.color ?? undefined,
      sex: dto.sex ?? undefined,
      castrated: dto.castrated ?? undefined,
      urlPhoto: dto.urlPhoto ?? undefined,
      status: dto.status ?? undefined,
      registrationDate: dto.registrationDate ? new Date(dto.registrationDate) : undefined,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
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
