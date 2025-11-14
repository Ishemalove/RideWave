import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { db } from '../../common/database';
import { Driver, UserRole } from '../../common/types';

@Injectable()
export class DriversService {
  getOnlineDrivers(): Driver[] {
    return db.listOnlineDrivers();
  }

  async toggleAvailability(driverId: string, isOnline: boolean) {
    const driver = db.getDriverById(driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }
    driver.isOnline = isOnline;
    return driver;
  }

  updateDriverLocation(
    driverId: string,
    lat: number,
    lng: number,
  ): Driver | undefined {
    const driver = db.getDriverById(driverId);
    if (!driver) return undefined;

    driver.currentLocation = { lat, lng };
    return driver;
  }
}
