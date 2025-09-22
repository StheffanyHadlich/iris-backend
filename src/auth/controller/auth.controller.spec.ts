import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      register: jest.fn(),
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login successfully when credentials are valid', async () => {
    // success: username found and password correct
    authService.validateUser!.mockResolvedValue({ id: 1, username: 'test', email: 'test@test.com' });
    authService.login!.mockReturnValue({ access_token: 'jwt-token' });

    const dto: LoginDto = { email: 'test@test.com', password: '123456' };
    const result = await controller.login(dto);

    expect(result).toEqual({ access_token: 'jwt-token' });
  });

  it('should throw error when credentials are invalid', async () => {
    // failure: validateUser returns null because email or password do not match
    authService.validateUser!.mockResolvedValue(null);

    const dto: LoginDto = { email: 'wrong@test.com', password: 'wrong' };
    await expect(controller.login(dto)).rejects.toThrow('Invalid Credentials');
  });

  it('should register user and return jwt token', async () => {
    authService.register!.mockResolvedValue({ access_token: 'jwt-token' });

    const dto: CreateUserDto = {
      username: 'newuser',
      email: 'new@test.com',
      password: '123456',
    };
    const result = await controller.register(dto);

    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
