// Unit tests for trips service

import { TripsService } from './trips.service';
import { VehicleType } from '../../common/types';

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(() => {
    service = new TripsService();
  });

  it('should calculate distance between two points', () => {
    // SF to Oakland (approx 11 km)
    const distance = service.calculateDistance(37.7749, -122.4194, 37.8044, -122.2712);
    expect(distance).toBeGreaterThan(10);
    expect(distance).toBeLessThan(15);
  });

  it('should estimate fare for economy vehicle', () => {
    const fare = service.estimateFare(
      37.7749, -122.4194,
      37.8044, -122.2712,
      VehicleType.ECONOMY,
      1.0
    );
    expect(fare).toBeGreaterThan(25);
  });

  it('should estimate ETA in minutes', () => {
    const distance = 10; // km
    const eta = service.estimateEta(distance);
    expect(eta).toBeGreaterThan(15);
    expect(eta).toBeLessThan(25);
  });
});
