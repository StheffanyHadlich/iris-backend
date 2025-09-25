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


  it('should create a pet associated with the authenticated user', async () => {
    // failure: this test fails if the service.create is not called with the authenticated userId
    // success: if successful, the created pet is linked to the authenticated user
    const dto: CreatePetDto = {
      name: 'Bobby',
      age: 3,
      type: 'dog',
      registrationDate: '2025-09-18',
    } as any;
    service.create.mockResolvedValue(mockPet);

    const result = await controller.create(dto, { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
    expect(service.create).toHaveBeenCalledWith(dto, 1);
  });

  it('should get pets for the authenticated user', async () => {
    // failure: this test fails if service.getPetsByUser is not called with the authenticated userId
    // success: if successful, returns only the pets owned by the authenticated user
    service.getPetsByUser.mockResolvedValue([mockPet]);
    const result = await controller.findAll({ user: { id: 1 } } as any);
    expect(result).toEqual([mockPet]);
    expect(service.getPetsByUser).toHaveBeenCalledWith(1);
  });

  it('should get a pet by id for owner', async () => {
    // failure: this test fails if service.getPet is not called with the correct petId and userId
    // success: if successful, returns the requested pet belonging to the authenticated user
    service.getPet.mockResolvedValue(mockPet);
    const result = await controller.findOne(1, { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
    expect(service.getPet).toHaveBeenCalledWith(1, 1);
  });

  it('should update a pet when authenticated user is owner', async () => {
    // failure: this test fails if the pet cannot be updated because it is not owned by the authenticated user
    // success: if successful, returns the updated pet with new values
    const dto: UpdatePetDto = { name: 'Updated' } as any;
    service.update.mockResolvedValue({ ...mockPet, name: 'Updated' });
    const result = await controller.update(1, dto, { user: { id: 1 } } as any);
    expect(result.name).toBe('Updated');
    expect(service.update).toHaveBeenCalledWith(1, dto, 1);
  });

  it('should assign pet to the authenticated user', async () => {
    // failure: this test fails if the pet is not properly assigned to the authenticated user
    // success: if successful, the pet gets associated with the correct userId
    service.assignPetToUser.mockResolvedValue(mockPet);
    const result = await controller.assignToUser(1, 1, { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
    expect(service.assignPetToUser).toHaveBeenCalledWith(1, 1, 1);
  });

  it('should remove a pet when owner', async () => {
    // failure: this test fails if the authenticated user is not the owner of the pet
    // success: if successful, returns the removed pet object
    service.remove.mockResolvedValue(mockPet);
    const result = await controller.remove(1, { user: { id: 1 } } as any);
    expect(result).toEqual(mockPet);
    expect(service.remove).toHaveBeenCalledWith(1, 1);
  });

  it('should throw ForbiddenException when trying to assign to another user', async () => {
    // failure: this test fails if controller allows assigning a pet to a different user
    // success: if successful, a ForbiddenException is thrown
    await expect(
      controller.assignToUser(1, 2, { user: { id: 1 } } as any),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should bubble up ForbiddenException from service when updating non-owned pet', async () => {
    // failure: this test fails if ForbiddenException from service is not propagated to the controller
    // success: if successful, controller throws ForbiddenException when trying to update non-owned pet
    const dto: UpdatePetDto = { name: 'Updated' } as any;
    service.update.mockRejectedValue(new ForbiddenException('Not authorized to update this pet.'));
    await expect(
      controller.update(1, dto, { user: { id: 1 } } as any),
    ).rejects.toThrow(ForbiddenException);
  });

});
