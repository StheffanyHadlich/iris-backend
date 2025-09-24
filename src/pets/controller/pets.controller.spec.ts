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
    req.user = { id: 1, username: 'testuser', email: 'test@example.com' };
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
  } as any;

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
    service = module.get(PetsService) as jest.Mocked<PetsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // creates a pet for the authenticated user
  it('should create a pet associated with the authenticated user', async () => {
    const dto: CreatePetDto = {
      name: 'Bobby',
      age: 3,
      type: 'dog',
      registrationDate: '2025-09-18',
    } as any;
    service.create.mockResolvedValue(mockPet);

    const result = await controller.create(dto, {
      user: { id: 1, username: 'u', email: 'e' },
    } as any);
    expect(result).toEqual(mockPet);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
  });

  // lists pets for authenticated user
  it('should get pets for the authenticated user', async () => {
    service.getPetsByUser.mockResolvedValue([mockPet]);
    const result = await controller.findAll({
      user: { id: 1, username: 'u', email: 'e' },
    } as any);
    expect(result).toEqual([mockPet]);
    expect(service.getPetsByUser).toHaveBeenCalledWith(1);
  });

  // retrieves a single pet (owner)
  it('should get a pet by id for owner', async () => {
    service.getPet.mockResolvedValue(mockPet);
    const result = await controller.findOne(1, {
      user: { id: 1, username: 'u', email: 'e' },
    } as any);
    expect(result).toEqual(mockPet);
    expect(service.getPet).toHaveBeenCalledWith(1, 1);
  });

  // update succeeds when owner
  it('should update a pet when authenticated user is owner', async () => {
    const dto: UpdatePetDto = { name: 'Updated' } as any;
    service.update.mockResolvedValue({ ...mockPet, name: 'Updated' });
    const result = await controller.update(1, dto, {
      user: { id: 1, username: 'u', email: 'e' },
    } as any);
    expect(result.name).toBe('Updated');
    expect(service.update).toHaveBeenCalledWith(1, dto, 1);
  });

  // assign to same user allowed
  it('should assign pet to the authenticated user', async () => {
    service.assignPetToUser.mockResolvedValue(mockPet);
    const result = await controller.assignToUser(1, 1, {
      user: { id: 1, username: 'u', email: 'e' },
    } as any);
    expect(result).toEqual(mockPet);
    expect(service.assignPetToUser).toHaveBeenCalledWith(1, 1, 1);
  });

  // delete succeeds when owner
  it('should remove a pet when owner', async () => {
    service.remove.mockResolvedValue(mockPet);
    const result = await controller.remove(1, {
      user: { id: 1, username: 'u', email: 'e' },
    } as any);
    expect(result).toEqual(mockPet);
    expect(service.remove).toHaveBeenCalledWith(1, 1);
  });

  // authorization failure: attempt to assign to another user should be forbidden by controller before calling service
  it('should throw ForbiddenException when trying to assign to another user', async () => {
    await expect(
      controller.assignToUser(1, 2, {
        user: { id: 1, username: 'u', email: 'e' },
      } as any),
    ).rejects.toThrow(ForbiddenException);
  });

  // simulate service-level ForbiddenException for update if service enforces it
  it('should bubble up ForbiddenException from service when updating non-owned pet', async () => {
    const dto: UpdatePetDto = { name: 'Updated' } as any;
    service.update.mockRejectedValue(
      new ForbiddenException('Not authorized to update this pet.'),
    );
    await expect(
      controller.update(1, dto, {
        user: { id: 1, username: 'u', email: 'e' },
      } as any),
    ).rejects.toThrow(ForbiddenException);
  });
});
