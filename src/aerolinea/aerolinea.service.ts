import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Aerolinea } from './entities/aerolinea.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Aeropuerto } from '../aeropuerto/entities/aeropuerto.entity';

@Injectable()
export class AerolineaService {

  private readonly logger = new Logger('AerolineaService');

  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,

    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>
  ) {}

  async create(createAerolineaDto: CreateAerolineaDto) {
    try {
      const currentDate = new Date();
      
      // Validar si la fecha de fundación es en el pasado
      if (new Date(createAerolineaDto.fechaDeFundacion) >= currentDate) {
        throw new BusinessLogicException('La fecha de fundación debe ser en el pasado', HttpStatus.BAD_REQUEST);
      }
  
      const aerolinea = this.aerolineaRepository.create(createAerolineaDto);
      await this.aerolineaRepository.save(aerolinea);
      return aerolinea;
    } catch (error) {
      throw new BusinessLogicException(error.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async findAll() {
    try {
      const aerolineas = await this.aerolineaRepository.find();
      return aerolineas;
    } catch (error) {
      throw new BusinessLogicException('Failed to get aerolineas due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: id }
    });
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolinea not found', HttpStatus.NOT_FOUND);
    }
    return aerolinea;
  }

  async update(id: string, updateAerolineaDto: UpdateAerolineaDto) {
    const aerolinea = await this.aerolineaRepository.preload({
      id: id,
      ...updateAerolineaDto,
    });
  
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolínea no encontrada', HttpStatus.NOT_FOUND);
    }
  
    // Validar si la fecha de fundación es en el pasado
    const currentDate = new Date();
    if (new Date(updateAerolineaDto.fechaDeFundacion) >= currentDate) {
      throw new BusinessLogicException('La fecha de fundación debe ser en el pasado', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.aerolineaRepository.save(aerolinea);
      return aerolinea;
    } catch (error) {
      throw new BusinessLogicException(error.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    const aerolinea = await this.findOne(id);
    try {
      await this.aerolineaRepository.remove(aerolinea);
    } catch (error) {
      throw new BusinessLogicException(error.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Asociar un aeropuerto a una aerolínea
  async addAirportToAirline(aerolineaId: string, aeropuertoIds: string[]) {
    // Buscar la aerolínea
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos']
    });
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolinea no encontrada', HttpStatus.NOT_FOUND);
    }
  
    // Buscar los aeropuertos
    const aeropuertos = await this.aeropuertoRepository.find({
      where: { id: In(aeropuertoIds) }
    });
  
    // Validar los aeropuertos encontrados
    this.validateArrayAeropuertos(aeropuertos, aeropuertoIds);
  
    // Asociar los aeropuertos a la aerolínea
    aerolinea.aeropuertos = [...new Set([...aerolinea.aeropuertos, ...aeropuertos])];
    
    // Guardar la aerolínea con los aeropuertos actualizados
    return await this.aerolineaRepository.save(aerolinea);
  }

  // Método de validación similar al validateArrayCulturas
  private validateArrayAeropuertos(aeropuertos: Aeropuerto[], aeropuertoIds: string[]) {
    if (aeropuertos.length !== aeropuertoIds.length) {
      throw new BusinessLogicException('Uno o más aeropuertos no fueron encontrados', HttpStatus.NOT_FOUND);
    }
  }

  // Obtener los aeropuertos que cubre una aerolínea
  async findAirportsFromAirline(aerolineaId: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos']
    });
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolinea no encontrada', HttpStatus.NOT_FOUND);
    }
    return aerolinea.aeropuertos;
  }

  // Obtener un aeropuerto que cubre una aerolínea
  async findAirportFromAirline(aerolineaId: string, aeropuertoId: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos']
    });
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolinea no encontrada', HttpStatus.NOT_FOUND);
    }

    const aeropuerto = aerolinea.aeropuertos.find(a => a.id === aeropuertoId);
    if (!aeropuerto) {
      throw new BusinessLogicException('Aeropuerto no encontrado en esta aerolínea', HttpStatus.NOT_FOUND);
    }

    return aeropuerto;
  }

  // Actualizar los aeropuertos que cubre una aerolínea
  async updateAirportsFromAirline(aerolineaId: string, aeropuertoIds: string[]) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos']
    });
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolinea no encontrada', HttpStatus.NOT_FOUND);
    }

    const aeropuertos = await this.aeropuertoRepository.findBy({ id: In(aeropuertoIds) });
    if (aeropuertos.length !== aeropuertoIds.length) {
      throw new BusinessLogicException('Uno o más aeropuertos no fueron encontrados', HttpStatus.NOT_FOUND);
    }

    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  // Eliminar un aeropuerto que cubre una aerolínea
  async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string) {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos']
    });
    if (!aerolinea) {
      throw new BusinessLogicException('Aerolinea no encontrada', HttpStatus.NOT_FOUND);
    }

    const aeropuerto = aerolinea.aeropuertos.find(a => a.id === aeropuertoId);
    if (!aeropuerto) {
      throw new BusinessLogicException('Aeropuerto no encontrado en esta aerolínea', HttpStatus.NOT_FOUND);
    }

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(a => a.id !== aeropuertoId);
    return await this.aerolineaRepository.save(aerolinea);
  }
}
