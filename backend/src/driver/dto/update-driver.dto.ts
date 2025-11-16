import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateDriverDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  currentLatitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  currentLongitude?: number;

  @ApiProperty({ example: 'vehicle-uuid', required: false })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'DL123456789', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;
}

