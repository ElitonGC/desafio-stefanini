import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  placeOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  nationality?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid CPF format' })
  cpf: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}