import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'overall';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(range: TimeRange): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'overall':
        start.setFullYear(2020);
        break;
    }

    return { start, end };
  }

  async getMetrics(range: TimeRange = 'overall', companyId?: string) {
    const { start, end } = this.getDateRange(range);

    const whereClause: any = {
      createdAt: {
        gte: range !== 'overall' ? start : undefined,
        lte: end,
      },
    };

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (whereClause.createdAt.gte === undefined) {
      delete whereClause.createdAt.gte;
    }

    const [
      totalBookings,
      totalRevenue,
      totalUsers,
      totalDrivers,
      totalCompanies,
      bookingsByStatus,
      bookingsByDate,
      revenueByDate,
      bookingsByCompany,
      revenueByCompany,
      userRegistrations,
      driverRegistrations,
    ] = await Promise.all([
      this.prisma.booking.count({
        where: whereClause,
      }),
      this.prisma.payment.aggregate({
        where: {
          ...whereClause,
          status: 'PAID',
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: range !== 'overall' ? start : undefined,
            lte: end,
          },
        },
      }),
      this.prisma.driver.count({
        where: {
          createdAt: {
            gte: range !== 'overall' ? start : undefined,
            lte: end,
          },
        },
      }),
      this.prisma.company.count({
        where: {
          createdAt: {
            gte: range !== 'overall' ? start : undefined,
            lte: end,
          },
        },
      }),
      this.prisma.booking.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
      }),
      this.getBookingsByDate(start, end, companyId),
      this.getRevenueByDate(start, end, companyId),
      this.getBookingsByCompany(start, end),
      this.getRevenueByCompany(start, end),
      this.getUserRegistrationsByDate(start, end),
      this.getDriverRegistrationsByDate(start, end),
    ]);

    return {
      summary: {
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalUsers,
        totalDrivers,
        totalCompanies,
      },
      bookingsByStatus: bookingsByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      bookingsByDate,
      revenueByDate,
      bookingsByCompany,
      revenueByCompany,
      userRegistrations,
      driverRegistrations,
    };
  }

  async getCompanies(pagination: PaginationDto, includeInactive = false) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = includeInactive ? {} : { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { domain: { contains: search } },
        { subdomain: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        include: {
          _count: {
            select: {
              users: true,
              drivers: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCompanyDetails(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            drivers: true,
            bookings: true,
            payments: true,
          },
        },
        users: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        drivers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            vehicle: {
              select: {
                vehicleNumber: true,
                vehicleType: true,
              },
            },
            isOnline: true,
            isApproved: true,
          },
        },
      },
    });
  }

  async getDrivers(pagination: PaginationDto, companyId?: string) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = companyId ? { companyId } : {};
    
    if (search) {
      where.OR = [
        { licenseNumber: { contains: search } },
        {
          vehicle: {
            vehicleNumber: { contains: search },
          },
        },
        {
          vehicle: {
            vehicleType: { contains: search },
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              vehicleNumber: true,
              vehicleType: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.driver.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPassengers(pagination: PaginationDto, companyId?: string) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = companyId ? { companyId } : {};
    where.role = 'CUSTOMER';
    
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTrips(
    pagination: PaginationDto,
    companyId?: string,
    filter?: 'today' | 'active' | 'completed' | 'cancelled',
  ) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where: any = companyId ? { companyId } : {};

    // Apply status filter
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.createdAt = { gte: today };
    } else if (filter === 'active') {
      where.status = { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] };
    } else if (filter === 'completed') {
      where.status = 'COMPLETED';
    } else if (filter === 'cancelled') {
      where.status = 'CANCELLED';
    }

    if (search) {
      where.OR = [
        { pickupAddress: { contains: search } },
        { dropAddress: { contains: search } },
        {
          customer: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ],
          },
        },
        { driver: { vehicle: { vehicleNumber: { contains: search } } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          driver: {
            select: {
              id: true,
              vehicle: {
                select: {
                  vehicleNumber: true,
                  vehicleType: true,
                },
              },
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async getBookingsByDate(start: Date, end: Date, companyId?: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        ...(companyId && { companyId }),
      },
      select: {
        createdAt: true,
      },
    });

    const grouped = bookings.reduce((acc, booking) => {
      const date = booking.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getRevenueByDate(start: Date, end: Date, companyId?: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: 'PAID',
        ...(companyId && { companyId }),
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    const grouped = payments.reduce((acc, payment) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(payment.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getBookingsByCompany(start: Date, end: Date) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    const grouped = bookings.reduce((acc, booking) => {
      const companyName = booking.company.name;
      acc[companyName] = (acc[companyName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([company, count]) => ({
      company,
      count,
    }));
  }

  private async getRevenueByCompany(start: Date, end: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: 'PAID',
      },
      include: {
        booking: {
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const grouped = payments.reduce((acc, payment) => {
      const companyName = payment.booking.company.name;
      acc[companyName] = (acc[companyName] || 0) + Number(payment.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([company, revenue]) => ({
      company,
      revenue,
    }));
  }

  private async getUserRegistrationsByDate(start: Date, end: Date) {
    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const grouped = users.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getDriverRegistrationsByDate(start: Date, end: Date) {
    const drivers = await this.prisma.driver.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const grouped = drivers.reduce((acc, driver) => {
      const date = driver.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getCollectionDetails(companyId?: string, startDate?: Date, endDate?: Date) {
    const where: any = companyId ? { companyId } : {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [payments, summary] = await Promise.all([
      this.prisma.payment.findMany({
        where: {
          ...where,
          status: 'PAID',
        },
        include: {
          booking: {
            select: {
              id: true,
              pickupAddress: true,
              dropAddress: true,
              customer: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          ...where,
          status: 'PAID',
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      payments,
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalCount: summary._count.id || 0,
        averageAmount: summary._count.id > 0 ? (summary._sum.amount || 0) / summary._count.id : 0,
      },
    };
  }

  async getAllData() {
    const [companies, users, drivers, bookings, payments] = await Promise.all([
      this.prisma.company.findMany({
        include: {
          _count: {
            select: {
              users: true,
              drivers: true,
              bookings: true,
            },
          },
        },
      }),
      this.prisma.user.findMany({
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.driver.findMany({
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.booking.findMany({
        include: {
          company: {
            select: {
              name: true,
            },
          },
          customer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.payment.findMany({
        include: {
          booking: {
            include: {
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      companies,
      users,
      drivers,
      bookings,
      payments,
    };
  }
}
