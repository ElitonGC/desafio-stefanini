import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: service },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { name: 'Test', cpf: '123.456.789-09', password: '123456', birthDate: '2000-01-01' } as any;
    service.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    service.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 1 }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    service.findOne.mockResolvedValue({ id: 1 });
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a user (PUT)', async () => {
    const dto: UpdateUserDto = { name: 'Updated' } as any;
    service.update.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.update('1', dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should update a user (PATCH)', async () => {
    const dto: UpdateUserDto = { name: 'Patched' } as any;
    service.update.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.patch('1', dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a user', async () => {
    service.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});