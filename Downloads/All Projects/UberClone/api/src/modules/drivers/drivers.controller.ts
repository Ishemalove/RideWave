import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { db } from '../../common/database';
import { UserRole } from '../../common/types';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('api/v1/drivers')
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Post('availability')
  @UseGuards(JwtGuard)
  async toggleAvailability(
    @Body() dto: { isOnline: boolean },
    @Request() req: any,
  ) {
    const driver = db.getDriverById(req.user.userId);

    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new BadRequestException('Not a driver');
    }

    const updated = await this.driversService.toggleAvailability(
      req.user.userId,
      dto.isOnline,
    );

    return {
      driverId: updated.id,
      isOnline: updated.isOnline,
    };
  }

  @Post('location')
  @UseGuards(JwtGuard)
  updateLocation(
    @Body() dto: { lat: number; lng: number },
    @Request() req: any,
  ) {
    const driver = db.getDriverById(req.user.userId);

    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new BadRequestException('Not a driver');
    }

    this.driversService.updateDriverLocation(req.user.userId, dto.lat, dto.lng);

    return {
      driverId: req.user.userId,
      location: { lat: dto.lat, lng: dto.lng },
    };
  }

  @Get('assigned')
  @UseGuards(JwtGuard)
  getAssignedTrip(@Request() req: any) {
    const driver = db.getDriverById(req.user.userId);

    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new BadRequestException('Not a driver');
    }

    // TODO: Return the current assigned trip for this driver
    return { tripId: null, status: 'no_trip_assigned' };
  }

  @Post(':id/accept')
  @UseGuards(JwtGuard)
  async acceptTrip(@Body() dto: { tripId: string }, @Request() req: any) {
    const driver = db.getDriverById(req.user.userId);

    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new BadRequestException('Not a driver');
    }

    const trip = db.getTripById(dto.tripId);

    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    const updated = db.updateTrip(dto.tripId, {
      driverId: req.user.userId,
      status: 'accepted' as any,
    });

    return { tripId: updated?.id, status: updated?.status };
  }
}
