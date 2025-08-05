import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

const mockUser = {
  id: 1,
  username: 'testuser',
  cpf: '123.456.789-09',
  password: 'hashed-password',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    usersService = {
      findByCpf: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token-jwt'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      usersService.findByCpf.mockResolvedValue(null);
      const result = await service.validateUser('000.000.000-00', 'senha');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      usersService.findByCpf.mockResolvedValue(mockUser);
      const result = await service.validateUser('123.456.789-09', 'errada');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = await service.login({ username: 'testuser', id: 1 });
      expect(result).toEqual({ access_token: 'token-jwt' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'testuser', sub: 1 });
    });
  });

  describe('signup', () => {
    it('should create user and return token', async () => {
      usersService.create.mockResolvedValue(mockUser);
      jest.spyOn(service, 'login').mockResolvedValue({ access_token: 'token-jwt' });
      const result = await service.signup({ username: 'testuser', cpf: '123.456.789-09', password: 'senha' });
      expect(usersService.create).toHaveBeenCalled();
      expect(service.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ access_token: 'token-jwt' });
    });
  });
});