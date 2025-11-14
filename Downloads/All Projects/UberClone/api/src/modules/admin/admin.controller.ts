import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { db } from '../../common/database';
import { UserRole } from '../../common/types';

@Controller('api/v1/admin')
@UseGuards(JwtGuard)
export class AdminController {
  @Get('users')
  listUsers(@Query('role') role?: string) {
    // Simplified: return all users (in production, add pagination + auth check)
    const users = Array.from(new Map([]).values());
    return { users, total: users.length };
  }

  @Get('drivers')
  listDrivers(@Query('status') status?: string) {
    // Simplified: return all drivers
    const drivers = Array.from(new Map([]).values());
    return { drivers, total: drivers.length };
  }

  @Get('trips')
  listTrips(
    @Query('status') status?: string,
    @Query('limit') limit: number = 50,
  ) {
    // Simplified: return trips
    const trips = Array.from(new Map([]).values()).slice(0, limit);
    return { trips, total: trips.length };
  }

  @Post('promo-codes')
  createPromoCode(
    @Body()
    dto: {
      code: string;
      discountType: 'fixed' | 'percentage';
      amount: number;
      validTo: string;
      usageLimit?: number;
    },
  ) {
    // Simplified: create promo code
    return {
      id: `promo_${Date.now()}`,
      code: dto.code,
      discountType: dto.discountType,
      amount: dto.amount,
      validTo: dto.validTo,
      usageLimit: dto.usageLimit,
    };
  }

  @Post('disable-user')
  disableUser(@Body() dto: { userId: string }) {
    const user = db.getUserById(dto.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.isActive = false;
    return { userId: user.id, isActive: user.isActive };
  }

  @Get('analytics/daily')
  getDailyAnalytics() {
    // Placeholder for daily analytics
    return {
      date: new Date().toISOString(),
      trips: 42,
      revenue: 850.5,
      activeRiders: 120,
      activeDrivers: 25,
    };
  }

  @Post('refund')
  refundTrip(@Body() dto: { tripId: string; reason?: string }) {
    const trip = db.getTripById(dto.tripId);
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    // TODO: Call payments service to process refund
    return {
      tripId: dto.tripId,
      refundStatus: 'pending',
      reason: dto.reason,
    };
  }
}
