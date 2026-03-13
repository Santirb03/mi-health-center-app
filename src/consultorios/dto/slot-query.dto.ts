import { IsDateString, IsNotEmpty } from 'class-validator';

export class SlotQueryDto {
    @IsNotEmpty()
    @IsDateString()
    date: string; // formato: YYYY-MM-DD
}
