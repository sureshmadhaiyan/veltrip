import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

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
        ...createDriverDto,
        companyId,
      },
      include: {
        company: true,
      },
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
    return this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
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

