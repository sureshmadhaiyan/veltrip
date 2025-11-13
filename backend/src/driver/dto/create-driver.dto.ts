import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'DL123456789' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: 'sedan' })
  @IsString()
  vehicleType: string;

  @ApiProperty({ example: 'KA01AB1234' })
  @IsString()
  vehicleNumber: string;

  @ApiProperty({ example: 'Toyota Camry', required: false })
  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @ApiProperty({ example: 'White', required: false })
  @IsOptional()
  @IsString()
  vehicleColor?: string;
}

