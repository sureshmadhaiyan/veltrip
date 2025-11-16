import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'DL123456789' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: 'vehicle-uuid', required: false, description: 'Vehicle ID (optional, can be assigned later)' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', description: 'Driver photo URL (required)' })
  @IsString()
  photo: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Gender (required)' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1990-01-15', description: 'Date of birth (required)' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyId?: string;
}

