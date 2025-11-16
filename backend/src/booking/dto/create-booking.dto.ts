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

  @ApiProperty({ example: 'customer-uuid', required: false, description: 'Customer ID (admin only)' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'company-uuid', required: false, description: 'Company ID (admin only)' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ example: 'driver-uuid', required: false, description: 'Driver ID (optional, will auto-assign if not provided)' })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({ example: 'vehicle-uuid', required: false, description: 'Vehicle ID (optional)' })
  @IsOptional()
  @IsString()
  vehicleId?: string;
}

