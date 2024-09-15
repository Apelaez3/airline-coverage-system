import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';

@Module({
  controllers: [AerolineaController],
  providers: [AerolineaService],
})
export class AerolineaModule {}
