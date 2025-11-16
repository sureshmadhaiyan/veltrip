import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateDriverWithUserDto {
  // User fields
  @ApiProperty({ example: 'driver@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  // Driver fields
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


