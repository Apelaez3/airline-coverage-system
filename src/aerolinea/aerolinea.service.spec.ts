import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Repository } from 'typeorm';
import { Aerolinea } from './entities/aerolinea.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';
import { NotFoundException } from '@nestjs/common';
import { Aeropuerto } from '../aeropuerto/entities/aeropuerto.entity';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<Aerolinea>;
  let aeropuertoRepository: Repository<Aeropuerto>;

  const mockAerolinea: Aerolinea = {
    id: '1',
    nombre: 'AeroTest',
    descripcion: 'Una aerolínea de prueba',
    fechaDeFundacion: undefined,
    paginaWeb: 'https://www.aerotest.com',
    aeropuertos: [],
  };

  const mockAeropuerto: Aeropuerto = {
    id: '1',
    nombre: 'Aeropuerto Test',
    codigo: 'AT3',
    pais: 'País Test',
    ciudad: 'Ciudad Test',
    aerolineas: [],
  };

  const mockAerolineaRepository = {
    create: jest.fn().mockReturnValue(mockAerolinea),
    save: jest.fn().mockResolvedValue(mockAerolinea),
    find: jest.fn().mockResolvedValue([mockAerolinea]),
    findOne: jest.fn().mockResolvedValue(mockAerolinea),
    preload: jest.fn().mockResolvedValue(mockAerolinea),
    remove: jest.fn().mockResolvedValue(mockAerolinea),
  };

  const mockAeropuertoRepository = {
    create: jest.fn().mockReturnValue(mockAeropuerto),
    save: jest.fn().mockResolvedValue(mockAeropuerto),
    find: jest.fn().mockResolvedValue([mockAeropuerto]),
    findOne: jest.fn().mockResolvedValue(mockAeropuerto),
    preload: jest.fn().mockResolvedValue(mockAeropuerto),
    remove: jest.fn().mockResolvedValue(mockAeropuerto),
    findBy: jest.fn().mockResolvedValue([mockAeropuerto]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaService,
        { provide: getRepositoryToken(Aerolinea), useValue: mockAerolineaRepository },
        { provide: getRepositoryToken(Aeropuerto), useValue: mockAeropuertoRepository },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<Aerolinea>>(getRepositoryToken(Aerolinea));
    aeropuertoRepository = module.get<Repository<Aeropuerto>>(getRepositoryToken(Aeropuerto));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an aerolinea', async () => {
      const createAerolineaDto: CreateAerolineaDto = {
        nombre: 'Test Aerolinea',
        descripcion: 'Descripción de la aerolínea',
        fechaDeFundacion: new Date('2000-01-01').toISOString(),
        paginaWeb: 'https://www.test-aerolinea.com',
      };
      const createdAerolinea = { id: '1', ...createAerolineaDto };
      jest.spyOn(repository, 'create').mockReturnValue(createdAerolinea as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdAerolinea as any);

      expect(await service.create(createAerolineaDto)).toEqual(createdAerolinea);
    });

    it('should throw an error if creation fails', async () => {
      const createAerolineaDto: CreateAerolineaDto = {
        nombre: 'Test Aerolinea',
        descripcion: 'Descripción de la aerolínea',
        fechaDeFundacion: new Date('2000-01-01').toISOString(),
        paginaWeb: 'https://www.test-aerolinea.com',
      };
      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createAerolineaDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of aerolineas', async () => {
      const aerolineas = [{ id: '1', nombre: 'Test Aerolinea', descripcion: 'Descripción de la aerolínea', fechaDeFundacion: new Date('2000-01-01'), paginaWeb: 'https://www.test-aerolinea.com', aeropuertos: [] }];
      jest.spyOn(repository, 'find').mockResolvedValue(aerolineas as any);

      expect(await service.findAll()).toEqual(aerolineas);
    });
  });

  describe('findOne', () => {
    it('should return an aerolinea by id', async () => {
      const aerolinea = { id: '1', nombre: 'Test Aerolinea', descripcion: 'Descripción de la aerolínea', fechaDeFundacion: new Date('2000-01-01'), paginaWeb: 'https://www.test-aerolinea.com', aeropuertos: [] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(aerolinea as any);

      expect(await service.findOne('1')).toEqual(aerolinea);
    });

    it('should throw an error if aerolinea is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update and return the aerolinea', async () => {
      const updateAerolineaDto: UpdateAerolineaDto = {
        nombre: 'Updated Aerolinea',
        descripcion: 'Descripción actualizada',
        fechaDeFundacion: new Date('2000-01-01').toISOString(),
        paginaWeb: 'https://www.updated-aerolinea.com',
      };
      const updatedAerolinea = { id: '1', ...updateAerolineaDto };
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedAerolinea as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedAerolinea as any);

      expect(await service.update('1', updateAerolineaDto)).toEqual(updatedAerolinea);
    });
  });

  describe('remove', () => {
    it('should successfully remove an aerolinea', async () => {
      const aerolinea = { id: '1', nombre: 'Test Aerolinea', descripcion: 'Descripción de la aerolínea', fechaDeFundacion: new Date('2000-01-01'), paginaWeb: 'https://www.test-aerolinea.com', aeropuertos: [] };
      jest.spyOn(service, 'findOne').mockResolvedValue(aerolinea as any); // Mock findOne to return the aerolinea
      jest.spyOn(repository, 'remove').mockResolvedValue(aerolinea as any); // Mock remove to resolve
  
      await expect(service.remove('1')).resolves.not.toThrow(); // Expect no exceptions
    });
  
    it('should throw a BusinessLogicException if removal fails', async () => {
      const aerolinea = { id: '1', nombre: 'Test Aerolinea', descripcion: 'Descripción de la aerolínea', fechaDeFundacion: new Date('2000-01-01'), paginaWeb: 'https://www.test-aerolinea.com', aeropuertos: [] };
      jest.spyOn(service, 'findOne').mockResolvedValue(aerolinea as any); // Mock findOne to return the aerolinea
      jest.spyOn(repository, 'remove').mockRejectedValue(new Error('Removal failed')); // Mock remove to reject
  
      await expect(service.remove('1')).rejects.toThrow(BusinessLogicException); // Expect BusinessLogicException
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return the list of airports from an airline', async () => {
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: [mockAeropuerto] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(aerolineaWithAirports as any);

      expect(await service.findAirportsFromAirline('1')).toEqual([mockAeropuerto]);
    });

    it('should throw an error if aerolinea is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findAirportsFromAirline('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return a specific airport from an airline', async () => {
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: [mockAeropuerto] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(aerolineaWithAirports as any);

      expect(await service.findAirportFromAirline('1', '1')).toEqual(mockAeropuerto);
    });

    it('should throw an error if airport is not found in the airline', async () => {
      const aerolineaWithNoAirports = { ...mockAerolinea, aeropuertos: [] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(aerolineaWithNoAirports as any);

      await expect(service.findAirportFromAirline('1', '1')).rejects.toThrow(BusinessLogicException);
    });

    it('should throw an error if aerolinea is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findAirportFromAirline('1', '1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update the airports for an airline', async () => {
      const updatedAeropuertos: Aeropuerto[] = [mockAeropuerto];
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: updatedAeropuertos };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAerolinea as any);
      jest.spyOn(aeropuertoRepository, 'find').mockResolvedValue(updatedAeropuertos as any); // Changed from 'findBy' to 'find'
      jest.spyOn(repository, 'save').mockResolvedValue(aerolineaWithAirports as any);
  
      expect(await service.updateAirportsFromAirline('1', ['1'])).toEqual(aerolineaWithAirports);
    });
  
    
  
    it('should throw an error if aerolinea is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(aeropuertoRepository, 'find').mockResolvedValue([mockAeropuerto]);
  
      await expect(service.updateAirportsFromAirline('1', ['1'])).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should remove an airport from an airline', async () => {
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: [mockAeropuerto] };
      const aerolineaWithNoAirports = { ...mockAerolinea, aeropuertos: [] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(aerolineaWithAirports as any);
      jest.spyOn(repository, 'save').mockResolvedValue(aerolineaWithNoAirports as any);

      expect(await service.deleteAirportFromAirline('1', '1')).toEqual(aerolineaWithNoAirports);
    });

    it('should throw an error if airport is not found in the airline', async () => {
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: [] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(aerolineaWithAirports as any);

      await expect(service.deleteAirportFromAirline('1', '1')).rejects.toThrow(BusinessLogicException);
    });

    it('should throw an error if aerolinea is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteAirportFromAirline('1', '1')).rejects.toThrow(BusinessLogicException);
    });
  });
});
