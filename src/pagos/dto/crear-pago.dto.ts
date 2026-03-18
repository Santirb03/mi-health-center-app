import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MetodoPago } from '@prisma/client';

export class CrearPagoDto {
    @IsNotEmpty()
    @IsUUID()
    reservaId: string;

    @IsNotEmpty()
    @IsEnum(MetodoPago)
    method: MetodoPago;

    @IsOptional()
    @IsString()
    transactionId?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
