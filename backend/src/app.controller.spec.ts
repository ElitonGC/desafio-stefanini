import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return "Ok!"', () => {
    expect(appController.getOk()).toBe('Ok!');
  });

  it('should call AppService.getOk', () => {
    const spy = jest.spyOn(appService, 'getOk').mockReturnValue('Test!');
    const controller = new AppController(appService);
    expect(controller.getOk()).toBe('Test!');
    expect(spy).toHaveBeenCalled();
  });
});