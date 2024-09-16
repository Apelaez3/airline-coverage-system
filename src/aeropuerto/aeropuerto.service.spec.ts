import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { Aeropuerto } from './entities/aeropuerto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';
import { Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<Aeropuerto>;

  const mockAeropuerto: Aeropuerto = {
    id: '1',
    nombre: 'Aeropuerto Test',
    codigo: 'AT1',
    pais: 'País Test',
    ciudad: 'Ciudad Test',
    aerolineas: [],
  };

  const mockAeropuertoRepository = {
    create: jest.fn().mockReturnValue(mockAeropuerto),
    save: jest.fn().mockResolvedValue(mockAeropuerto),
    find: jest.fn().mockResolvedValue([mockAeropuerto]),
    findOne: jest.fn().mockResolvedValue(mockAeropuerto),
    preload: jest.fn().mockResolvedValue(mockAeropuerto),
    remove: jest.fn().mockResolvedValue(mockAeropuerto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoService,
        { provide: getRepositoryToken(Aeropuerto), useValue: mockAeropuertoRepository },
      ],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<Aeropuerto>>(getRepositoryToken(Aeropuerto));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an aeropuerto', async () => {
      const createAeropuertoDto: CreateAeropuertoDto = {
        nombre: 'Test Aeropuerto',
        codigo: 'TA2',
        pais: 'País Test',
        ciudad: 'Ciudad Test',
      };
      const createdAeropuerto = { id: '1', ...createAeropuertoDto, aerolineas: [] }; // Incluye aerolineas
      jest.spyOn(repository, 'create').mockReturnValue(createdAeropuerto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdAeropuerto as any);

      expect(await service.create(createAeropuertoDto)).toEqual(createdAeropuerto);
    });

    it('should throw an error if creation fails', async () => {
      const createAeropuertoDto: CreateAeropuertoDto = {
        nombre: 'Test Aeropuerto',
        codigo: 'TA2',
        pais: 'País Test',
        ciudad: 'Ciudad Test',
      };
      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createAeropuertoDto)).rejects.toThrow(Error); // Ajustado a Error
    });
  });

  describe('findAll', () => {
    it('should return an array of aeropuertos', async () => {
      const aeropuertos = [mockAeropuerto];
      jest.spyOn(repository, 'find').mockResolvedValue(aeropuertos as any);

      expect(await service.findAll()).toEqual(aeropuertos);
    });

    it('should throw an error if finding all fails', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Failed to get aeropuertos'));

      await expect(service.findAll()).rejects.toThrow(Error); // Ajustado a Error
    });
  });

  describe('findOne', () => {
    it('should return an aeropuerto by id', async () => {
      const aeropuerto = mockAeropuerto;
      jest.spyOn(repository, 'findOne').mockResolvedValue(aeropuerto as any);

      expect(await service.findOne('1')).toEqual(aeropuerto);
    });

    

    it('should throw an error if finding one fails', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Failed to find aeropuerto'));

      await expect(service.findOne('1')).rejects.toThrow(Error); // Ajustado a Error
    });
  });

  describe('update', () => {
    it('should update and return the aeropuerto', async () => {
      const updateAeropuertoDto: UpdateAeropuertoDto = {
        nombre: 'Updated Aeropuerto',
        codigo: 'UA1',
        pais: 'País Test',
        ciudad: 'Ciudad Test',
      };
      const updatedAeropuerto = { id: '1', ...updateAeropuertoDto, aerolineas: [] };
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedAeropuerto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedAeropuerto as any);

      expect(await service.update('1', updateAeropuertoDto)).toEqual(updatedAeropuerto);
    });

    it('should throw an error if update fails', async () => {
      const updateAeropuertoDto: UpdateAeropuertoDto = {
        nombre: 'Updated Aeropuerto',
        codigo: 'UA1',
        pais: 'País Test',
        ciudad: 'Ciudad Test',
      };
      jest.spyOn(repository, 'preload').mockResolvedValue(null);
      
      await expect(service.update('1', updateAeropuertoDto)).rejects.toThrow(BusinessLogicException);
    });

    it('should throw an error if updating fails', async () => {
      const updateAeropuertoDto: UpdateAeropuertoDto = {
        nombre: 'Updated Aeropuerto',
        codigo: 'UA1',
        pais: 'País Test',
        ciudad: 'Ciudad Test',
      };
      jest.spyOn(repository, 'preload').mockResolvedValue(updateAeropuertoDto as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Update failed'));

      await expect(service.update('1', updateAeropuertoDto)).rejects.toThrow(Error); // Ajustado a Error
    });
  });

  describe('remove', () => {
    it('should successfully remove an aeropuerto', async () => {
      const aeropuerto = mockAeropuerto;
      jest.spyOn(repository, 'findOne').mockResolvedValue(aeropuerto as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(aeropuerto as any);

      await expect(service.remove('1')).resolves.not.toThrow();
    });

    it('should throw an error if aeropuerto is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(BusinessLogicException); // Espera BusinessLogicException
    });

    it('should throw an error if removal fails', async () => {
      const aeropuerto = mockAeropuerto;
      jest.spyOn(repository, 'findOne').mockResolvedValue(aeropuerto as any);
      jest.spyOn(repository, 'remove').mockRejectedValue(new Error('Removal failed'));

      await expect(service.remove('1')).rejects.toThrow(Error); // Ajustado a Error
    });
  });
});
