import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsEnum,
    IsArray,
} from 'class-validator';
import { ConsultorioStatus } from '@prisma/client';

export class CrearConsultorioDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    capacity: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    pricePerHour: number;

    @IsOptional()
    @IsString()
    floor?: string;

    @IsOptional()
    @IsString()
    roomNumber?: string;

    @IsOptional()
    @IsArray()
    amenities?: string[];

    @IsOptional()
    @IsEnum(ConsultorioStatus)
    status?: ConsultorioStatus;
}
