import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto {
  @ApiProperty({ enum: BookingStatus, required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ example: 12.9716, required: false })
  @IsOptional()
  @IsNumber()
  pickupLatitude?: number;

  @ApiProperty({ example: 77.5946, required: false })
  @IsOptional()
  @IsNumber()
  pickupLongitude?: number;

  @ApiProperty({ example: '123 Main Street, Bangalore', required: false })
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiProperty({ example: 12.9352, required: false })
  @IsOptional()
  @IsNumber()
  dropLatitude?: number;

  @ApiProperty({ example: 77.6245, required: false })
  @IsOptional()
  @IsNumber()
  dropLongitude?: number;

  @ApiProperty({ example: '456 Park Avenue, Bangalore', required: false })
  @IsOptional()
  @IsString()
  dropAddress?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false, description: 'Trip start date time' })
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @ApiProperty({ example: '2024-01-15T12:00:00Z', required: false, description: 'Trip end date time' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiProperty({ example: 1000.5, required: false, description: 'Starting odometer reading in km' })
  @IsOptional()
  @IsNumber()
  startingKm?: number;

  @ApiProperty({ example: 1050.5, required: false, description: 'Ending odometer reading in km' })
  @IsOptional()
  @IsNumber()
  endingKm?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  actualFare?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ example: 'driver-uuid', required: false })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({ example: 'vehicle-uuid', required: false })
  @IsOptional()
  @IsString()
  vehicleId?: string;
}

