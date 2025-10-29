import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AdoptionRepository } from '../repository/adoption.repository';
import { PetsRepository } from '../../pets/repository/pets.repository';
import { CreateAdoptionDto } from '../dto/create-adoption.dto';
import { UpdateAdoptionDto } from '../dto/update-adoption.dto';
import { Adoption, PetStatus } from '@prisma/client';

@Injectable()
export class AdoptionService {
  constructor(
    private readonly adoptionRepository: AdoptionRepository,
    private readonly petsRepository: PetsRepository,
  ) {}

  async create(dto: CreateAdoptionDto): Promise<Adoption> {
    const pet = await this.petsRepository.findById(dto.petId);
    if (!pet) throw new NotFoundException('Pet not found');

    if (pet.status === PetStatus.ADOPTED) {
      throw new BadRequestException('This pet has already been adopted');
    }

    const existingAdoption = await this.adoptionRepository.findByPetId(dto.petId);
    if (existingAdoption) {
      throw new BadRequestException('This pet is already associated with an adoption record');
    }

    const adoption = await this.adoptionRepository.create({
      pet: { connect: { id: dto.petId } },
      adopter: { connect: { id: dto.adopterId } },
      startDate: new Date(dto.adoptionDate),
      status: 'ACTIVE',
    });

    await this.petsRepository.update(dto.petId, { status: PetStatus.ADOPTED });

    return adoption;
  }

  async findAll(): Promise<Adoption[]> {
    return this.adoptionRepository.findAll();
  }

  async findOne(id: number): Promise<Adoption> {
    const adoption = await this.adoptionRepository.findById(id);
    if (!adoption) throw new NotFoundException('Adoption not found');
    return adoption;
  }

  async update(id: number, dto: UpdateAdoptionDto): Promise<Adoption> {
    await this.findOne(id); // ensure it exists

    return this.adoptionRepository.update(id, {
      startDate: dto.adoptionDate ? new Date(dto.adoptionDate) : undefined,
      status: dto.status,
    });
  }

  async remove(id: number): Promise<Adoption> {
    return this.adoptionRepository.delete(id);
  }
}
