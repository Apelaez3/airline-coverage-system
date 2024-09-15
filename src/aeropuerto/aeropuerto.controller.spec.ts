import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoController } from './aeropuerto.controller';
import { AeropuertoService } from './aeropuerto.service';

describe('AeropuertoController', () => {
  let controller: AeropuertoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AeropuertoController],
      providers: [AeropuertoService],
    }).compile();

    controller = module.get<AeropuertoController>(AeropuertoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
