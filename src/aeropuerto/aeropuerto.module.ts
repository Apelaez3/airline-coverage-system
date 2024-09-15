import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  controllers: [AeropuertoController],
  providers: [AeropuertoService],
})
export class AeropuertoModule {}
