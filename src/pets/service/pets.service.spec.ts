import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PetsRepository } from '../repository/pets.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PetsService', () => {
  let service: PetsService;
  let petsRepo: Partial<PetsRepository>;
  let usersRepo: Partial<UsersRepository>;

  beforeEach(async () => {
    petsRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      assignToUser: jest.fn(),
    };

    usersRepo = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: PetsRepository, useValue: petsRepo },
        { provide: UsersRepository, useValue: usersRepo },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  it('should create a pet with an existing user', async () => {
    // failure: this test fails if the pet is created without checking that the user exists
    // success: if successful, pet is created and correctly linked to the given userId
    const dto = { name: 'Rex', age: 3, type: 'Dog', race: 'Labrador', registrationDate: new Date().toISOString() };
    (usersRepo.findById as jest.Mock).mockResolvedValue({ id: 1 });
    (petsRepo.create as jest.Mock).mockResolvedValue({ id: 1, ...dto, userId: 1 });

    const pet = await service.create(dto, 1);
    expect(usersRepo.findById).toHaveBeenCalledWith(1);
    expect(petsRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Rex', userId: 1 }));
    expect(pet.userId).toBe(1);
  });

  it('should throw NotFoundException if user does not exist when creating pet', async () => {
    // failure: this test fails if service.create does not validate that the user exists
    // success: if successful, throws NotFoundException when user does not exist
    const dto = { 
      name: 'Rex', 
      age: 3, 
      type: 'Dog', 
      race: 'Labrador', 
      registrationDate: new Date().toISOString() 
    };
    (usersRepo.findById as jest.Mock).mockResolvedValue(null);

    await expect(service.create(dto, 99)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user does not exist when assigning', async () => {
    // failure: this test fails if service.assignPetToUser does not check user existence
    // success: if successful, throws NotFoundException when assigning to a non-existent user
    (petsRepo.findById as jest.Mock).mockResolvedValue({ id: 1, userId: null });
    (usersRepo.findById as jest.Mock).mockResolvedValue(null);

    await expect(service.assignPetToUser(1, 42)).rejects.toThrow(NotFoundException);
  });

  it('should assign pet to user', async () => {
    // failure: this test fails if the pet is not updated with the given userId
    // success: if successful, the pet is assigned to the specified user and returned
    const petData = { id: 1, userId: null };
    const userData = { id: 42 };
    (petsRepo.findById as jest.Mock).mockResolvedValue(petData);
    (usersRepo.findById as jest.Mock).mockResolvedValue(userData);
    (petsRepo.assignToUser as jest.Mock).mockResolvedValue({ ...petData, userId: 42 });

    const pet = await service.assignPetToUser(1, 42);
    expect(petsRepo.assignToUser).toHaveBeenCalledWith(1, 42);
    expect(pet.userId).toBe(42);
  });

  it('should throw BadRequestException if pet already assigned to another user', async () => {
    // failure: this test fails if service.assignPetToUser allows re-assigning a pet that already has a user
    // success: if successful, throws BadRequestException when pet is already assigned to another user
    (petsRepo.findById as jest.Mock).mockResolvedValue({ id: 1, userId: 2 });
    (usersRepo.findById as jest.Mock).mockResolvedValue({ id: 3 });

    await expect(service.assignPetToUser(1, 3)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when updating non-existent pet', async () => {
    // failure: this test fails if service.update allows updating a non-existent pet
    // success: if successful, throws NotFoundException when pet is not found
    (petsRepo.findById as jest.Mock).mockResolvedValue(null);
    await expect(service.update(1, { name: 'New' }, 1)).rejects.toThrow(NotFoundException);
  });

  it('should remove a pet', async () => {
    // failure: this test fails if service.remove does not delete the pet or returns null
    // success: if successful, returns the deleted pet object
    const pet = { id: 1, userId: 1 };
    (petsRepo.findById as jest.Mock).mockResolvedValue(pet);
    (petsRepo.delete as jest.Mock).mockResolvedValue(pet);

    const removed = await service.remove(1, 1);
    expect(removed).toEqual(pet);
  });

});
