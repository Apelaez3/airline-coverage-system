import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';
import { AgregarAeropuertosDto } from './dto/agregar-aeropuertos.dto';

@Controller('airlines')
export class AerolineaController {
  constructor(private readonly aerolineaService: AerolineaService) {}

  @Post()
  create(@Body() createAerolineaDto: CreateAerolineaDto) {
    return this.aerolineaService.create(createAerolineaDto);
  }

  @Get()
  findAll() {
    return this.aerolineaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aerolineaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAerolineaDto: UpdateAerolineaDto) {
    return this.aerolineaService.update(id, updateAerolineaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aerolineaService.remove(id);
  }

  @Post(':id/airports')
  async addAirpots(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() AgregarAeropuertosDto: AgregarAeropuertosDto
  ){
    return this.aerolineaService.addAirportToAirline(id, AgregarAeropuertosDto.aeropuertosIds);
  }

  @Get(':id/airports')
  async findAirportsFromAirline(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.aerolineaService.findAirportsFromAirline(id);
  }

  @Get(':id/airports/:aeropuertoId')
  async findAirportFromAirline(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string
  ){
    return this.aerolineaService.findAirportFromAirline(id, aeropuertoId);
  }

  // @Put(':id/airports/:aeropuertoId')
  // async updateAirportFromAirline(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string,
  //   @Body() AgregarAeropuertosDto: AgregarAeropuertosDto
  // ){
  //   return this.aerolineaService.updateAirporstFromAirline(id, aeropuertoId, AgregarAeropuertosDto.aeropuertosIds);
  // }

  @Put(':id/airports/:aeropuertoId')
  async updateAirportFromAirline(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarAeropuertosDto: AgregarAeropuertosDto
  ){
    return this.aerolineaService.updateAirportsFromAirline(id, agregarAeropuertosDto.aeropuertosIds);
  }

  @Delete(':id/airports/:aeropuertoId')
  async removeAirportFromAirline(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string
  ){
    return this.aerolineaService.deleteAirportFromAirline(id, aeropuertoId);
  }


}
