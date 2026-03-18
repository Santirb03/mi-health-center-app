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
import { PaginationDto } from '../common/dto/pagination.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /** Ruta pública — registro de doctores */
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    /** Solo admin puede listar todos los usuarios */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin)
    @Get()
    findAll(@Query() pagination: PaginationDto) {
        return this.usersService.findAll(pagination.page, pagination.limit);
    }

    /** Cualquier usuario autenticado puede ver un perfil */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findOne(id);
    }

    /** Cualquier usuario autenticado puede actualizar su perfil */
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    /** Solo admin puede eliminar usuarios */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove(id);
    }
}
