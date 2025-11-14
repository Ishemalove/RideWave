import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TripsService } from './trips.service';
import { EstimateDto, CreateTripDto } from './trips.dto';
import { db } from '../../common/database';
import { Trip, TripStatus, UserRole } from '../../common/types';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('api/v1/trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post('estimate')
  estimate(@Body() dto: EstimateDto) {
    const distance = this.tripsService.calculateDistance(
      dto.pickupLat,
      dto.pickupLng,
      dto.dropoffLat,
      dto.dropoffLng,
    );

    const fareEstimate = this.tripsService.estimateFare(
      dto.pickupLat,
      dto.pickupLng,
      dto.dropoffLat,
      dto.dropoffLng,
      dto.vehicleType,
      1.0, // No surge for now
    );

    const etaMinutes = this.tripsService.estimateEta(distance);

    return {
      distance: Math.round(distance * 10) / 10,
      fare: fareEstimate,
      eta: etaMinutes,
      currency: 'USD',
    };
  }

  @Post()
  @UseGuards(JwtGuard)
  async createTrip(@Body() dto: CreateTripDto, @Request() req: any) {
    const rider = db.getUserById(req.user.userId);

    if (!rider || rider.role !== UserRole.RIDER) {
      throw new BadRequestException('Only riders can create trips');
    }

    const distance = this.tripsService.calculateDistance(
      dto.pickupLat,
      dto.pickupLng,
      dto.dropoffLat,
      dto.dropoffLng,
    );

    const fareEstimate = this.tripsService.estimateFare(
      dto.pickupLat,
      dto.pickupLng,
      dto.dropoffLat,
      dto.dropoffLng,
      dto.vehicleType,
      1.0,
    );

    const trip: Trip = {
      id: randomUUID(),
      riderId: req.user.userId,
      pickupPoint: { lat: dto.pickupLat, lng: dto.pickupLng },
      dropoffPoint: { lat: dto.dropoffLat, lng: dto.dropoffLng },
      vehicleType: dto.vehicleType,
      fareEstimate,
      status: TripStatus.REQUESTED,
      createdAt: new Date(),
    };

    db.createTrip(trip);

    // TODO: Emit WebSocket event to notify drivers
    console.log(`[Trip] New trip created: ${trip.id}`);

    return {
      tripId: trip.id,
      status: trip.status,
      fareEstimate: trip.fareEstimate,
      pickupPoint: trip.pickupPoint,
      dropoffPoint: trip.dropoffPoint,
    };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getTrip(@Param('id') id: string) {
    const trip = db.getTripById(id);

    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    return trip;
  }

  @Post(':id/cancel')
  @UseGuards(JwtGuard)
  async cancelTrip(@Param('id') id: string, @Request() req: any) {
    const trip = db.getTripById(id);

    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    if (
      trip.riderId !== req.user.userId &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException('Not authorized to cancel this trip');
    }

    const updated = db.updateTrip(id, {
      status: TripStatus.CANCELLED,
      endedAt: new Date(),
    });

    return { status: updated?.status };
  }
}
