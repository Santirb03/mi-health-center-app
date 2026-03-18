import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    specialty?: string;

    @IsOptional()
    @IsString()
    licenseNumber?: string;
}
