import { Injectable } from '@nestjs/common';
import { db } from '../../common/database';
import { Driver, Trip, TripStatus } from '../../common/types';

@Injectable()
export class MatchingService {
  /**
   * Find nearest drivers within a radius.
   * Uses in-memory storage (will use Redis Geo + PostGIS in production).
   */
  findNearestDrivers(
    lat: number,
    lng: number,
    radiusKm: number = 5,
    limit: number = 3,
  ): Driver[] {
    const onlineDrivers = db.listOnlineDrivers();

    const driversWithDistance = onlineDrivers
      .map((driver) => {
        const distance = this.calculateDistance(
          lat,
          lng,
          driver.currentLocation?.lat || 0,
          driver.currentLocation?.lng || 0,
        );
        return { driver, distance };
      })
      .filter((d) => d.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((d) => d.driver);

    return driversWithDistance;
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async matchTrip(trip: Trip, timeoutMs: number = 30000): Promise<Driver | null> {
    // Get pickup coordinates
    const { lat, lng } = trip.pickupPoint;

    // Find nearest available drivers
    const nearestDrivers = this.findNearestDrivers(lat, lng, 5, 3);

    if (nearestDrivers.length === 0) {
      console.log(`[Matching] No drivers found for trip ${trip.id}`);
      return null;
    }

    // TODO: In production, emit WebSocket events to drivers and wait for acceptance
    // For now, just assign the nearest driver
    const selectedDriver = nearestDrivers[0];

    console.log(
      `[Matching] Trip ${trip.id} matched to driver ${selectedDriver.id}`,
    );

    return selectedDriver;
  }
}
