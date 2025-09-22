import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from '../service/pets.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { Pet } from '@prisma/client';

class MockAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, username: 'testuser', email: 'test@example.com', role: 'USER' };
    return true;
  }
}

describe('PetsController', () => {
  let controller: PetsController;
  let service: jest.Mocked<PetsService>;

  const mockPet: Pet = {
    id: 1,
    name: 'Bobby',
    age: 3,
    type: 'dog',
    race: 'Labrador',
    currentWeight: null,
    urlPhoto: null,
    status: 'AVAILABLE',
    registrationDate: new Date(),
    userId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        {
          provide: PetsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            getPet: jest.fn(),
            getPetsByUser: jest.fn(),
            update: jest.fn(),
            assignPetToUser: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<PetsController>(PetsController);
    service = module.get(PetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // success: pet created for authenticated user
  it('should create a pet associated with the authenticated user', async () => {
    const dto: CreatePetDto = {
      name: 'Bobby',
      age: 3,
      type: 'dog',
      registrationDate: '2025-09-18',
    };
    service.create.mockResolvedValue(mockPet);

    const result = await controller.create(dto, { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
  });

  // failure: user tries to create pet for another user
  it('should throw if user tries to create pet for another user', async () => {
    const dto: CreatePetDto = {
      name: 'Max',
      age: 2,
      type: 'cat',
      registrationDate: '2025-11-11',
      userId: 99, // another user
    };

    await expect(controller.create(dto, { user: { id: 1, role: 'USER' } } as any)).rejects.toThrow(
      ForbiddenException,
    );
  });

  // success: fetch all pets
  it('should get all pets', async () => {
    service.findAll.mockResolvedValue([mockPet]);
    const result = await controller.findAll();
    expect(result).toEqual([mockPet]);
  });

  // success: fetch pet by id
  it('should get a pet by id', async () => {
    service.getPet.mockResolvedValue(mockPet);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockPet);
  });

  // success: fetch pets by user id
  it('should get pets by user id', async () => {
    service.getPetsByUser.mockResolvedValue([mockPet]);
    const result = await controller.findByUser('1');
    expect(result).toEqual([mockPet]);
  });

  // success: update pet if owner
  it('should update a pet if owner', async () => {
    service.getPet.mockResolvedValue(mockPet);
    service.update.mockResolvedValue({ ...mockPet, name: 'Updated' });
    const dto: UpdatePetDto = { name: 'Updated' };
    const result = await controller.update('1', dto, { user: { id: 1 } } as any);
    expect(result.name).toBe('Updated');
  });

  // failure: user tries to update pet they do not own
  it('should throw if user tries to update pet they do not own', async () => {
    service.getPet.mockResolvedValue({ ...mockPet, userId: 99 });
    const dto: UpdatePetDto = { name: 'Hacked' };

    await expect(
      controller.update('1', dto, { user: { id: 1, role: 'USER' } } as any),
    ).rejects.toThrow(ForbiddenException);
  });

  // success: assign pet to user if same as auth user
  it('should assign a pet to user if same as auth user', async () => {
    service.assignPetToUser.mockResolvedValue(mockPet);
    const result = await controller.assignToUser('1', 1 as any, { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
  });

  // success: delete pet if owner
  it('should remove a pet if owner', async () => {
    service.getPet.mockResolvedValue(mockPet);
    service.remove.mockResolvedValue(mockPet);
    const result = await controller.remove('1', { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
  });

  // failure: user tries to delete pet they do not own
  it('should throw if user tries to delete pet they do not own', async () => {
    service.getPet.mockResolvedValue({ ...mockPet, userId: 99 });

    await expect(
      controller.remove('1', { user: { id: 1, role: 'USER' } } as any),
    ).rejects.toThrow(ForbiddenException);
  });
});
