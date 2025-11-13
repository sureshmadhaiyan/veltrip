import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Veltrip Inc' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'veltrip.com' })
  @IsString()
  domain: string;

  @ApiProperty({ example: 'veltrip', required: false })
  @IsOptional()
  @IsString()
  subdomain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  theme?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  razorpayKeyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  razorpayKeySecret?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

