import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoController } from './aeropuerto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aeropuerto } from './entities/aeropuerto.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Aeropuerto])],
  controllers: [AeropuertoController],
  providers: [AeropuertoService],
})
export class AeropuertoModule {}
