import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 12.9716 })
  @IsNumber()
  pickupLatitude: number;

  @ApiProperty({ example: 77.5946 })
  @IsNumber()
  pickupLongitude: number;

  @ApiProperty({ example: '123 Main Street, Bangalore' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ example: 12.9352 })
  @IsNumber()
  dropLatitude: number;

  @ApiProperty({ example: 77.6245 })
  @IsNumber()
  dropLongitude: number;

  @ApiProperty({ example: '456 Park Avenue, Bangalore' })
  @IsString()
  dropAddress: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

