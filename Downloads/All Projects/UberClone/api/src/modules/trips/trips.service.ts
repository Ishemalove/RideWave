import { Injectable } from '@nestjs/common';
import { VehicleType } from '../../common/types';

@Injectable()
export class TripsService {
  private baseFares = {
    [VehicleType.ECONOMY]: 2.5, // $ per km
    [VehicleType.XL]: 3.5,
    [VehicleType.PREMIUM]: 5.0,
  };

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    // Haversine formula (simplified)
    const R = 6371; // Earth radius in km
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

  estimateFare(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
    vehicleType: VehicleType,
    surgePricing = 1.0,
  ): number {
    const distance = this.calculateDistance(
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
    );
    const baseFare = this.baseFares[vehicleType];
    const fare = distance * baseFare * surgePricing;
    return Math.round(fare * 100) / 100; // Round to 2 decimals
  }

  estimateEta(distance: number): number {
    // Rough estimate: 30km/h average urban speed
    return Math.ceil((distance / 30) * 60); // minutes
  }
}
