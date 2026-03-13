import { Module } from '@nestjs/common';
import { ConsultoriosService } from './consultorios.service';
import { ConsultoriosController } from './consultorios.controller';

@Module({
    controllers: [ConsultoriosController],
    providers: [ConsultoriosService],
    exports: [ConsultoriosService],
})
export class ConsultoriosModule { }
