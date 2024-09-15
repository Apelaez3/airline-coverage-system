import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { CreateAeropuertoDto } from './dto/create-aeropuerto.dto';
import { UpdateAeropuertoDto } from './dto/update-aeropuerto.dto';

@Controller('aeropuerto')
export class AeropuertoController {
  constructor(private readonly aeropuertoService: AeropuertoService) {}

  @Post()
  create(@Body() createAeropuertoDto: CreateAeropuertoDto) {
    return this.aeropuertoService.create(createAeropuertoDto);
  }

  @Get()
  findAll() {
    return this.aeropuertoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aeropuertoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAeropuertoDto: UpdateAeropuertoDto) {
    return this.aeropuertoService.update(+id, updateAeropuertoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aeropuertoService.remove(+id);
  }
}
