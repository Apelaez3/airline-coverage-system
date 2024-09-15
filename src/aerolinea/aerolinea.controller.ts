import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { CreateAerolineaDto } from './dto/create-aerolinea.dto';
import { UpdateAerolineaDto } from './dto/update-aerolinea.dto';

@Controller('aerolinea')
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
    return this.aerolineaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAerolineaDto: UpdateAerolineaDto) {
    return this.aerolineaService.update(+id, updateAerolineaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aerolineaService.remove(+id);
  }
}
