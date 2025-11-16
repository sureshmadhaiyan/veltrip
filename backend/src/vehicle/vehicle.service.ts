import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto, companyId: string) {
    // Check if vehicle number already exists
    const existing = await this.prisma.vehicle.findUnique({
      where: { vehicleNumber: createVehicleDto.vehicleNumber },
    });

    if (existing) {
      throw new ConflictException('Vehicle with this number already exists');
    }

    const data: any = {
      ...createVehicleDto,
      companyId,
    };

    // Convert date strings to Date objects
    if (createVehicleDto.registrationDate) {
      data.registrationDate = new Date(createVehicleDto.registrationDate);
    }
    if (createVehicleDto.insuranceExpiry) {
      data.insuranceExpiry = new Date(createVehicleDto.insuranceExpiry);
    }
    if (createVehicleDto.permitExpiry) {
      data.permitExpiry = new Date(createVehicleDto.permitExpiry);
    }

    return this.prisma.vehicle.create({
      data,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            drivers: true,
          },
        },
      },
    });
  }

  async findAll(companyId?: string) {
    return this.prisma.vehicle.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        drivers: {
          select: {
            id: true,
            licenseNumber: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        drivers: {
          select: {
            id: true,
            userId: true,
            licenseNumber: true,
            isApproved: true,
            isOnline: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto, user?: any) {
    const vehicle = await this.findOne(id);

    // Check permissions
    if (user && user.role !== 'ADMIN' && vehicle.companyId !== user.companyId) {
      throw new ForbiddenException('You can only update vehicles from your own company');
    }

    // Check if vehicle number is being changed and if it already exists
    if (updateVehicleDto.vehicleNumber && updateVehicleDto.vehicleNumber !== vehicle.vehicleNumber) {
      const existing = await this.prisma.vehicle.findUnique({
        where: { vehicleNumber: updateVehicleDto.vehicleNumber },
      });

      if (existing) {
        throw new ConflictException('Vehicle with this number already exists');
      }
    }

    const updateData: any = { ...updateVehicleDto };

    // Convert date strings to Date objects
    if (updateVehicleDto.registrationDate) {
      updateData.registrationDate = new Date(updateVehicleDto.registrationDate);
    }
    if (updateVehicleDto.insuranceExpiry) {
      updateData.insuranceExpiry = new Date(updateVehicleDto.insuranceExpiry);
    }
    if (updateVehicleDto.permitExpiry) {
      updateData.permitExpiry = new Date(updateVehicleDto.permitExpiry);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            drivers: true,
          },
        },
      },
    });
  }

  async remove(id: string, user?: any) {
    const vehicle = await this.findOne(id);

    // Check permissions
    if (user && user.role !== 'ADMIN' && vehicle.companyId !== user.companyId) {
      throw new ForbiddenException('You can only delete vehicles from your own company');
    }

    // Check if vehicle is assigned to any driver
    const driversCount = await this.prisma.driver.count({
      where: { vehicleId: id },
    });

    if (driversCount > 0) {
      throw new ConflictException('Cannot delete vehicle that is assigned to drivers');
    }

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
