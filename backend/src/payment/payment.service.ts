import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string, companyId: string) {
    // Verify booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id: createPaymentDto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new BadRequestException('You can only pay for your own bookings');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Booking must be completed before payment');
    }

    const amount = createPaymentDto.amount || booking.estimatedFare;

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: createPaymentDto.bookingId,
        userId,
        companyId,
        amount,
        method: createPaymentDto.method || PaymentMethod.RAZORPAY,
        status: PaymentStatus.PENDING,
        razorpayOrderId: createPaymentDto.razorpayOrderId,
      },
      include: {
        booking: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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

    return payment;
  }

  async findAll(companyId?: string, userId?: string) {
    return this.prisma.payment.findMany({
      where: {
        ...(companyId && { companyId }),
        ...(userId && { userId }),
      },
      include: {
        booking: {
          select: {
            id: true,
            pickupAddress: true,
            dropAddress: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
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
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async verifyPayment(id: string, razorpayPaymentId: string, razorpaySignature: string) {
    const payment = await this.findOne(id);

    // TODO: Implement Razorpay signature verification
    // For now, we'll just update the status
    // In production, verify the signature using Razorpay SDK

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: PaymentStatus.PAID,
      },
    });

    // Update booking payment status
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    return updatedPayment;
  }
}

