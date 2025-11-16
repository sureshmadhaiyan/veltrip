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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: any) {
    // If admin/company provides customerId, use it; otherwise use current user
    const customerId = (user.role === UserRole.ADMIN || user.role === UserRole.COMPANY) && createBookingDto.customerId
      ? createBookingDto.customerId
      : user.userId;
    // If admin provides companyId, use it; otherwise use current user's company
    const companyId = (user.role === UserRole.ADMIN) && createBookingDto.companyId
      ? createBookingDto.companyId
      : user.companyId;
    return this.bookingService.create(createBookingDto, customerId, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  findAll(@CurrentUser() user: any) {
    if (user.role === UserRole.CUSTOMER) {
      return this.bookingService.findAll(user.companyId, user.userId);
    }
    return this.bookingService.findAll(user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingService.cancel(id, reason, user.userId);
  }

  @Post(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Confirm booking' })
  confirm(@Param('id') id: string) {
    return this.bookingService.confirm(id);
  }

  @Post(':id/assign-driver')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Assign driver to booking' })
  assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    return this.bookingService.assignDriver(id, driverId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Delete booking' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingService.remove(id, user);
  }
}

