import { Injectable } from '@nestjs/common';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aeropuerto } from './entities/aeropuerto.entity';
import { Logger } from '@nestjs/common';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AeropuertoService {

private readonly logger = new Logger('AeropuertoServive')

constructor(
  @InjectRepository(Aeropuerto)
  private readonly aeropuertoRepository: Repository<Aeropuerto>,
) {}

  async create(createAeropuertoDto: CreateAeropuertoDto) {
    try{
      const aeropuerto = this.aeropuertoRepository.create(createAeropuertoDto);
      await this.aeropuertoRepository.save(aeropuerto);
      return aeropuerto;
    }catch(error){
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findAll() {
    try{
      const aeropuertos = this.aeropuertoRepository.find();
      return aeropuertos;
    }catch(error){
      throw new BusinessLogicException('Failed to get aeropuertos due to a server error', HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findOne(id: string) {
    const aeropuerto = await this.aeropuertoRepository.findOne(
      { where: { id: id } }
    );
    if (!aeropuerto) {
      throw new BusinessLogicException('Aeropuerto not found', HttpStatus.NOT_FOUND )
    }
    return aeropuerto;
  }

  async update(id: string, updateAeropuertoDto: UpdateAeropuertoDto) {
    const aeropuerto = await this.aeropuertoRepository.preload({
      id: id,
      ...updateAeropuertoDto,
    });
    if (!aeropuerto) {
      throw new BusinessLogicException('Aeropuerto not found', HttpStatus.NOT_FOUND );}
    try{
      await this.aeropuertoRepository.save(aeropuerto);
      return aeropuerto;
    }catch(error){
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async remove(id: string) {
    const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: id } });
    if (!aeropuerto) {
      throw new BusinessLogicException('Aeropuerto not found', HttpStatus.NOT_FOUND);
    }
    await this.aeropuertoRepository.remove(aeropuerto);
  }
}
