import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import type { TimeRange } from './admin.service';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get admin metrics' })
  async getMetrics(
    @Query('range') range: TimeRange = 'overall',
    @CurrentUser() user: any,
  ) {
    const companyId = user.role === UserRole.COMPANY ? user.companyId : undefined;
    return this.adminService.getMetrics(range, companyId);
  }

  @Get('data')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all data (Admin only)' })
  async getAllData() {
    return this.adminService.getAllData();
  }

  @Get('companies')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get companies list with pagination' })
  async getCompanies(
    @Query() pagination: PaginationDto,
    @Query('includeInactive') includeInactive?: string,
    @CurrentUser() user?: any,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    return this.adminService.getCompanies(pagination, includeInactiveFlag);
  }

  @Get('companies/:id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get company details' })
  async getCompanyDetails(@Param('id') id: string) {
    return this.adminService.getCompanyDetails(id);
  }

  @Get('drivers')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get drivers list with pagination' })
  async getDrivers(
    @Query() pagination: PaginationDto,
    @CurrentUser() user?: any,
  ) {
    const companyId = user?.role === UserRole.COMPANY ? user.companyId : undefined;
    return this.adminService.getDrivers(pagination, companyId);
  }

  @Get('passengers')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get passengers list with pagination' })
  async getPassengers(
    @Query() pagination: PaginationDto,
    @CurrentUser() user?: any,
  ) {
    const companyId = user?.role === UserRole.COMPANY ? user.companyId : undefined;
    return this.adminService.getPassengers(pagination, companyId);
  }

  @Get('trips')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get trips list with pagination and filters' })
  async getTrips(
    @Query() pagination: PaginationDto,
    @Query('filter') filter?: 'today' | 'active' | 'completed' | 'cancelled',
    @CurrentUser() user?: any,
  ) {
    const companyId = user?.role === UserRole.COMPANY ? user.companyId : undefined;
    return this.adminService.getTrips(pagination, companyId, filter);
  }

  @Get('collections')
  @Roles(UserRole.ADMIN, UserRole.COMPANY)
  @ApiOperation({ summary: 'Get collection details (payments)' })
  async getCollectionDetails(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CurrentUser() user?: any,
  ) {
    const companyId = user?.role === UserRole.COMPANY ? user.companyId : undefined;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.getCollectionDetails(companyId, start, end);
  }
}

