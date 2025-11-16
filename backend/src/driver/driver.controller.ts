import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { CreateDriverWithUserDto } from './dto/create-driver-with-user.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Create a new driver (with existing user)' })
  create(@Body() createDriverDto: CreateDriverDto, @CurrentUser() user: any) {
    const companyId = user.role === UserRole.COMPANY ? user.companyId : undefined;
    if (!companyId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Company ID is required');
    }
    return this.driverService.create(createDriverDto, companyId || user.companyId);
  }

  @Post('with-user')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Create a new driver with user account' })
  createWithUser(@Body() createDriverWithUserDto: CreateDriverWithUserDto, @CurrentUser() user: any) {
    const companyId = user.role === UserRole.COMPANY ? user.companyId : createDriverWithUserDto.companyId;
    return this.driverService.createWithUser(createDriverWithUserDto, companyId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get all drivers' })
  findAll(@CurrentUser() user: any) {
    const companyId = user.role === UserRole.COMPANY ? user.companyId : undefined;
    return this.driverService.findAll(companyId);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available drivers near location' })
  @ApiQuery({ name: 'latitude', type: Number })
  @ApiQuery({ name: 'longitude', type: Number })
  findAvailable(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @CurrentUser() user: any,
  ) {
    return this.driverService.findAvailableDrivers(
      user.companyId,
      parseFloat(latitude.toString()),
      parseFloat(longitude.toString()),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update driver' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Remove driver' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.driverService.remove(id, user);
  }
}

