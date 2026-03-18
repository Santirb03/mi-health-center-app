import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDateString,
    IsUUID,
} from 'class-validator';

export class CrearReservaDto {
    @IsNotEmpty()
    @IsUUID()
    consultorioId: string;

    /** Formato ISO 8601, debe ser una fecha futura */
    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    /** Formato ISO 8601, debe ser posterior al startTime */
    @IsNotEmpty()
    @IsDateString()
    endTime: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
