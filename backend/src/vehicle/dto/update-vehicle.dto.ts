import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, IsDateString } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class UpdateVehicleDto {
  @ApiProperty({ example: 'KA01AB1234', required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiProperty({ example: 'sedan', required: false })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiProperty({ example: 'Toyota Camry', required: false })
  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @ApiProperty({ example: 'White', required: false })
  @IsOptional()
  @IsString()
  vehicleColor?: string;

  @ApiProperty({ example: 2020, required: false })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiProperty({ example: '2020-01-15', required: false })
  @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  insuranceExpiry?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsDateString()
  permitExpiry?: string;

  @ApiProperty({ enum: VehicleStatus, required: false })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}

