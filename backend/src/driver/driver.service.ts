import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { CreateDriverWithUserDto } from './dto/create-driver-with-user.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto, companyId: string) {
    // Verify user exists and belongs to company
    const user = await this.prisma.user.findUnique({
      where: { id: createDriverDto.userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new NotFoundException('User not found or does not belong to company');
    }

    if (user.role !== 'DRIVER') {
      throw new ForbiddenException('User must have DRIVER role');
    }

    return this.prisma.driver.create({
      data: {
        userId: createDriverDto.userId,
        licenseNumber: createDriverDto.licenseNumber,
        vehicleId: createDriverDto.vehicleId,
        photo: createDriverDto.photo,
        gender: createDriverDto.gender,
        dateOfBirth: new Date(createDriverDto.dateOfBirth),
        companyId,
      },
      include: {
        company: true,
      },
    });
  }

  async createWithUser(createDriverWithUserDto: CreateDriverWithUserDto, companyId?: string) {
    if (!companyId) {
      throw new ForbiddenException('Company ID is required');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createDriverWithUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDriverWithUserDto.password, 10);

    // Create user and driver in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create user with DRIVER role
      const user = await tx.user.create({
        data: {
          email: createDriverWithUserDto.email,
          password: hashedPassword,
          firstName: createDriverWithUserDto.firstName,
          lastName: createDriverWithUserDto.lastName,
          phone: createDriverWithUserDto.phone,
          role: UserRole.DRIVER,
          companyId,
        },
      });

      // Create driver record
      const driver = await tx.driver.create({
        data: {
          userId: user.id,
          licenseNumber: createDriverWithUserDto.licenseNumber,
          vehicleId: createDriverWithUserDto.vehicleId,
          photo: createDriverWithUserDto.photo,
          gender: createDriverWithUserDto.gender,
          dateOfBirth: new Date(createDriverWithUserDto.dateOfBirth),
          companyId,
        },
        include: {
          company: true,
        },
      });

      return driver;
    });
  }

  async findAll(companyId?: string) {
    return this.prisma.driver.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
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
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
            vehicleType: true,
            vehicleModel: true,
            vehicleColor: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            photo: true,
            gender: true,
            dateOfBirth: true,
            isActive: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async findAvailableDrivers(companyId: string, latitude: number, longitude: number) {
    // Find online and approved drivers
    const drivers = await this.prisma.driver.findMany({
      where: {
        companyId,
        isOnline: true,
        isApproved: true,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Sort by distance (simple calculation, can be improved with PostGIS)
    return drivers
      .filter((d) => d.currentLatitude && d.currentLongitude)
      .sort((a, b) => {
        const distA = this.calculateDistance(
          latitude,
          longitude,
          a.currentLatitude!,
          a.currentLongitude!,
        );
        const distB = this.calculateDistance(
          latitude,
          longitude,
          b.currentLatitude!,
          b.currentLongitude!,
        );
        return distA - distB;
      });
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    await this.findOne(id);
    const updateData: any = { ...updateDriverDto };

    // Convert dateOfBirth string to Date if provided
    if (updateDriverDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateDriverDto.dateOfBirth);
    }

    // Handle vehicleId - set to null if empty string
    if (updateDriverDto.vehicleId === '') {
      updateData.vehicleId = null;
    }

    return this.prisma.driver.update({
      where: { id },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
            vehicleType: true,
            vehicleModel: true,
            vehicleColor: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            photo: true,
            gender: true,
            dateOfBirth: true,
            isActive: true,
          },
        },
      },
    });
  }

  async remove(id: string, user?: any) {
    const driver = await this.findOne(id);
    
    // Check if user has permission (admin or same company)
    if (user && user.role !== 'ADMIN' && driver.companyId !== user.companyId) {
      throw new ForbiddenException('You can only delete drivers from your own company');
    }
    
    return this.prisma.driver.update({
      where: { id },
      data: { isApproved: false, isOnline: false },
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

