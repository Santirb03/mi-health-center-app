import { IsDateString, IsNotEmpty } from 'class-validator';

export class DisponibilidadQueryDto {
    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNotEmpty()
    @IsDateString()
    endTime: string;
}
