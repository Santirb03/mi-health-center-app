import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CrearPagoDto } from './dto/crear-pago.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) { }

    @Post()
    create(@Body() crearPagoDto: CrearPagoDto) {
        return this.pagosService.create(crearPagoDto);
    }

    @Get()
    findAll() {
        return this.pagosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.pagosService.findOne(id);
    }

    @Patch(':id/reembolso')
    refund(@Param('id', ParseUUIDPipe) id: string) {
        return this.pagosService.refund(id);
    }
}
