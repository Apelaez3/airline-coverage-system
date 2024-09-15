import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaController } from './aerolinea.controller';
import { AerolineaService } from './aerolinea.service';

describe('AerolineaController', () => {
  let controller: AerolineaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AerolineaController],
      providers: [AerolineaService],
    }).compile();

    controller = module.get<AerolineaController>(AerolineaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
