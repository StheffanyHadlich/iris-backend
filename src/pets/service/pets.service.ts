import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pet } from '@prisma/client';
import { PetsRepository } from '../repository/pets.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreatePetDto, userId?: number): Promise<Pet> {
    if (userId) {
      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }

    const data: Prisma.PetCreateInput = {
      name: dto.name,
      age: dto.age,
      type: dto.type,
      race: dto.race,
      currentWeight: dto.currentWeight ? new Prisma.Decimal(dto.currentWeight) : undefined,
      urlPhoto: dto.urlPhoto,
      status: dto.status ?? 'AVAILABLE',
      registrationDate: new Date(dto.registrationDate),
      user: userId ? { connect: { id: userId } } : undefined,
    };

    return this.petsRepository.create(data);
  }

  async assignPetToUser(petId: number, userId: number): Promise<Pet> {
    const pet = await this.petsRepository.findById(petId);
    if (!pet) throw new NotFoundException(`Pet with id ${petId} not found`);

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    if (pet.userId && pet.userId !== userId) {
      throw new BadRequestException(`Pet already assigned to another user`);
    }

    return this.petsRepository.assignToUser(petId, userId);
  }

  async getPetsByUser(userId: number): Promise<Pet[]> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return this.petsRepository.findByUserId(userId);
  }

  async getPet(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);
    return pet;
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.findAll();
  }

  async update(id: number, dto: UpdatePetDto): Promise<Pet> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);

    const data: Prisma.PetUpdateInput = {
      name: dto.name,
      age: dto.age,
      type: dto.type,
      race: dto.race,
      currentWeight: dto.currentWeight ? new Prisma.Decimal(dto.currentWeight) : undefined,
      urlPhoto: dto.urlPhoto,
      status: dto.status,
      registrationDate: dto.registrationDate ? new Date(dto.registrationDate) : undefined,
    };

    return this.petsRepository.update(id, data);
  }

  async remove(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findById(id);
    if (!pet) throw new NotFoundException(`Pet with id ${id} not found`);

    return this.petsRepository.delete(id);
  }
}
