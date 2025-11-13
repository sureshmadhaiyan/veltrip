import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverService } from '../driver/driver.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private driverService: DriverService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string, companyId: string) {
    // Calculate distance (simplified, can use Google Maps API)
    const distance = this.calculateDistance(
      createBookingDto.pickupLatitude,
      createBookingDto.pickupLongitude,
      createBookingDto.dropLatitude,
      createBookingDto.dropLongitude,
    );

    // Calculate estimated fare (base fare + distance * rate)
    const baseFare = 50; // Base fare in INR
    const ratePerKm = 10; // Rate per kilometer
    const estimatedFare = baseFare + distance * ratePerKm;

    // Find nearest available driver
    const availableDrivers = await this.driverService.findAvailableDrivers(
      companyId,
      createBookingDto.pickupLatitude,
      createBookingDto.pickupLongitude,
    );

    const driverId = availableDrivers.length > 0 ? availableDrivers[0].id : null;

    const booking = await this.prisma.booking.create({
      data: {
        customerId: userId,
        driverId,
        companyId,
        pickupLatitude: createBookingDto.pickupLatitude,
        pickupLongitude: createBookingDto.pickupLongitude,
        pickupAddress: createBookingDto.pickupAddress,
        dropLatitude: createBookingDto.dropLatitude,
        dropLongitude: createBookingDto.dropLongitude,
        dropAddress: createBookingDto.dropAddress,
        distance,
        estimatedFare,
        scheduledAt: createBookingDto.scheduledAt ? new Date(createBookingDto.scheduledAt) : null,
        status: BookingStatus.PENDING,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        driver: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
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
      },
    });

    return booking;
  }

  async findAll(companyId?: string, userId?: string) {
    return this.prisma.booking.findMany({
      where: {
        ...(companyId && { companyId }),
        ...(userId && { customerId: userId }),
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        driver: {
          select: {
            id: true,
            vehicleNumber: true,
            vehicleType: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
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
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    const updateData: any = { ...updateBookingDto };

    // Handle status transitions
    if (updateBookingDto.status) {
      if (updateBookingDto.status === BookingStatus.IN_PROGRESS && !booking.startedAt) {
        updateData.startedAt = new Date();
      }
      if (updateBookingDto.status === BookingStatus.COMPLETED && !booking.completedAt) {
        updateData.completedAt = new Date();
        updateData.actualFare = updateBookingDto.actualFare || booking.estimatedFare;
      }
      if (updateBookingDto.status === BookingStatus.CANCELLED && !booking.cancelledAt) {
        updateData.cancelledAt = new Date();
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        driver: {
          select: {
            id: true,
            vehicleNumber: true,
          },
        },
      },
    });
  }

  async cancel(id: string, reason: string, userId: string) {
    const booking = await this.findOne(id);

    if (booking.customerId !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    return this.update(id, {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason,
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

