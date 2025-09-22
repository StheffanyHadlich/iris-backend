import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repository/users.repository';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Partial<UsersRepository>;

  beforeEach(async () => {
    repo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should throw error if email exists', async () => {
    // failure: does not allow creating user if email is already registered
    (repo.findByEmail as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(
      service.create({ username: 'x', email: 'a@b.com', password: '123' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a user without returning password', async () => {
    // success: creates user and ensures that the password is not returned in the response
    (repo.findByEmail as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockImplementation((data) =>
      Promise.resolve({ ...data, id: 1, createdAt: new Date() })
    );

    const user = await service.create({
      username: 'x',
      email: 'a@b.com',
      password: '123',
    });

    expect(user.id).toBe(1);
    expect(user).not.toHaveProperty('password');
  });
});
