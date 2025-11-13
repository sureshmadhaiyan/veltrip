import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vehicleColor?: string;
}

