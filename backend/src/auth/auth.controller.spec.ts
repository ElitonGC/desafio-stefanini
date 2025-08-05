import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;
  let usersService: any;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };
    usersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token if user is valid', async () => {
      const user = { id: 1, username: 'test' };
      authService.validateUser.mockResolvedValue(user);
      authService.login.mockResolvedValue({ access_token: 'token' });

      const result = await controller.login({ cpf: '123', password: 'senha' });
      expect(authService.validateUser).toHaveBeenCalledWith('123', 'senha');
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw UnauthorizedException if user is invalid', async () => {
      authService.validateUser.mockResolvedValue(null);
      await expect(controller.login({ cpf: '123', password: 'senha' }))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should create user and return token', async () => {
      const user = { id: 1, username: 'test' };
      usersService.create.mockResolvedValue(user);
      authService.login.mockResolvedValue({ access_token: 'token' });

      const dto: CreateUserDto = { cpf: '123', password: 'senha', name: 'Test', birthDate: '2000-01-01' } as any;
      const result = await controller.signup(dto);
      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});