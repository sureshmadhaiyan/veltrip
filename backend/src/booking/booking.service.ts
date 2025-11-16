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

    // Find nearest available driver (only if not provided)
    let driverId: string | null = null;
    if (!createBookingDto.driverId) {
      const availableDrivers = await this.driverService.findAvailableDrivers(
        companyId,
        createBookingDto.pickupLatitude,
        createBookingDto.pickupLongitude,
      );
      driverId = availableDrivers.length > 0 ? availableDrivers[0].id : null;
    } else {
      driverId = createBookingDto.driverId;
    }

    // If vehicleId is provided and driver doesn't have a vehicle, assign it
    if (createBookingDto.vehicleId && driverId) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
      });
      if (driver && !driver.vehicleId) {
        await this.prisma.driver.update({
          where: { id: driverId },
          data: { vehicleId: createBookingDto.vehicleId },
        });
      }
    }

    const booking = await this.prisma.booking.create({
      data: {
        customerId: userId,
        driverId,
        companyId: createBookingDto.companyId || companyId,
        pickupLatitude: createBookingDto.pickupLatitude,
        pickupLongitude: createBookingDto.pickupLongitude,
        pickupAddress: createBookingDto.pickupAddress,
        dropLatitude: createBookingDto.dropLatitude,
        dropLongitude: createBookingDto.dropLongitude,
        dropAddress: createBookingDto.dropAddress,
        distance,
        startingKm: createBookingDto.startingKm,
        endingKm: createBookingDto.endingKm,
        estimatedFare,
        scheduledAt: createBookingDto.scheduledAt ? new Date(createBookingDto.scheduledAt) : null,
        startedAt: createBookingDto.startedAt ? new Date(createBookingDto.startedAt) : null,
        completedAt: createBookingDto.completedAt ? new Date(createBookingDto.completedAt) : null,
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

    // Recalculate distance and fare if pickup/drop locations changed
    if (
      updateBookingDto.pickupLatitude &&
      updateBookingDto.pickupLongitude &&
      updateBookingDto.dropLatitude &&
      updateBookingDto.dropLongitude
    ) {
      const distance = this.calculateDistance(
        updateBookingDto.pickupLatitude,
        updateBookingDto.pickupLongitude,
        updateBookingDto.dropLatitude,
        updateBookingDto.dropLongitude,
      );
      updateData.distance = distance;
      
      // Recalculate estimated fare
      const baseFare = 50;
      const ratePerKm = 10;
      updateData.estimatedFare = baseFare + distance * ratePerKm;
    }

        // Handle date conversions
        if (updateBookingDto.scheduledAt) {
          updateData.scheduledAt = new Date(updateBookingDto.scheduledAt);
        }
        if (updateBookingDto.startedAt) {
          updateData.startedAt = new Date(updateBookingDto.startedAt);
        }
        if (updateBookingDto.completedAt) {
          updateData.completedAt = new Date(updateBookingDto.completedAt);
        }

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
            vehicle: {
              select: {
                vehicleNumber: true,
              },
            },
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

  async confirm(id: string) {
    const booking = await this.findOne(id);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    return this.update(id, {
      status: BookingStatus.ACCEPTED,
    });
  }

  async assignDriver(id: string, driverId: string) {
    const booking = await this.findOne(id);

    // Verify driver exists and belongs to same company
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (driver.companyId !== booking.companyId) {
      throw new BadRequestException('Driver must belong to the same company');
    }

    if (!driver.isApproved || !driver.isOnline) {
      throw new BadRequestException('Driver must be approved and online');
    }

    return this.update(id, {
      driverId,
      status: booking.status === BookingStatus.PENDING ? BookingStatus.ACCEPTED : booking.status,
    });
  }

  async remove(id: string, user: any) {
    const booking = await this.findOne(id);

    // Only allow deletion if booking is cancelled or pending
    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot delete completed or in-progress bookings');
    }

    // Check permissions
    if (user.role !== 'ADMIN' && booking.companyId !== user.companyId) {
      throw new BadRequestException('You can only delete bookings from your own company');
    }

    return this.prisma.booking.delete({
      where: { id },
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

