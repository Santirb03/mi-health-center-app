import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { ConsultoriosService } from './consultorios.service';
import { CrearConsultorioDto } from './dto/crear-consultorio.dto';
import { DisponibilidadQueryDto } from './dto/disponibilidad-query.dto';
import { SlotQueryDto } from './dto/slot-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultorios')
export class ConsultoriosController {
    constructor(private readonly consultoriosService: ConsultoriosService) { }

    /** Solo admin puede crear consultorios */
    @Roles(UserRole.admin)
    @Post()
    create(@Body() crearConsultorioDto: CrearConsultorioDto) {
        return this.consultoriosService.create(crearConsultorioDto);
    }

    /** Todos los autenticados pueden ver la lista */
    @Get()
    findAll() {
        return this.consultoriosService.findAll();
    }

    /**
     * Consultorios disponibles en un rango de tiempo.
     * GET /consultorios/disponibilidad?startTime=2026-03-10T09:00:00Z&endTime=2026-03-10T11:00:00Z
     */
    @Get('disponibilidad')
    findDisponiblesEnRango(@Query() query: DisponibilidadQueryDto) {
        return this.consultoriosService.findDisponiblesEnRango(query);
    }

    /** Consultorios con status=available (sin filtro de reservas) */
    @Get('disponibles')
    findDisponibles() {
        return this.consultoriosService.findDisponibles();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.consultoriosService.findOne(id);
    }

    /**
     * Slots horarios de un consultorio en una fecha.
     * GET /consultorios/:id/slots?date=2026-03-10
     */
    @Get(':id/slots')
    getSlots(
        @Param('id', ParseUUIDPipe) id: string,
        @Query() query: SlotQueryDto,
    ) {
        return this.consultoriosService.getSlotsDelConsultorio(id, query.date);
    }

    /** Solo admin puede modificar y eliminar */
    @Roles(UserRole.admin)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: Partial<CrearConsultorioDto>,
    ) {
        return this.consultoriosService.update(id, updateDto);
    }

    @Roles(UserRole.admin)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.consultoriosService.remove(id);
    }
}
