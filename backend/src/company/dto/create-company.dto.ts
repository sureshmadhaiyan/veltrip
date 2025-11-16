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

  @ApiProperty({ example: 'ABCDE1234F', required: false })
  @IsOptional()
  @IsString()
  pan?: string;

  @ApiProperty({ example: '29ABCDE1234F1Z5', required: false })
  @IsOptional()
  @IsString()
  gstin?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Maharashtra', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '400001', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'contact@company.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  contactPerson?: string;
}

