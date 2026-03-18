import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ReservasService } from './reservas.service';
import { CrearReservaDto } from './dto/crear-reserva.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('reservas')
export class ReservasController {
    constructor(private readonly reservasService: ReservasService) { }

    /** Cualquier doctor autenticado puede crear una reserva */
    @Post()
    create(
        @CurrentUser() user: { id: string },
        @Body() crearReservaDto: CrearReservaDto,
    ) {
        return this.reservasService.create(user.id, crearReservaDto);
    }

    /** Solo admin puede ver todas las reservas */
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll(@Query() pagination: PaginationDto) {
        return this.reservasService.findAll(pagination.page, pagination.limit);
    }

    /** Cada doctor ve solo sus reservas */
    @Get('mis-reservas')
    findMine(@CurrentUser() user: { id: string }, @Query() pagination: PaginationDto) {
        return this.reservasService.findByUser(user.id, pagination.page, pagination.limit);
    }

    /** Cualquier autenticado puede ver el detalle de una reserva */
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.reservasService.findOne(id);
    }

    /** El dueño de la reserva o un admin puede cancelarla */
    @Patch(':id/cancelar')
    cancel(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: { id: string; role: string },
    ) {
        return this.reservasService.cancel(id, user.id, user.role);
    }
}
