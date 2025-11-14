// In-memory storage for local dev (will be replaced by actual DB later)

import { User, Driver, Trip, OtpRecord } from '../common/types';


class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private drivers: Map<string, Driver> = new Map();
  private trips: Map<string, Trip> = new Map();
  private otps: Map<string, OtpRecord> = new Map();

  // Users
  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  findUserByPhone(phone: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.phone === phone);
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  // Drivers
  getDriverById(id: string): Driver | undefined {
    return this.drivers.get(id);
  }

  createDriver(driver: Driver): Driver {
    this.drivers.set(driver.id, driver);
    return driver;
  }

  listOnlineDrivers(): Driver[] {
    return Array.from(this.drivers.values()).filter(d => d.isOnline);
  }

  // Trips
  createTrip(trip: Trip): Trip {
    this.trips.set(trip.id, trip);
    return trip;
  }

  getTripById(id: string): Trip | undefined {
    return this.trips.get(id);
  }

  updateTrip(id: string, updates: Partial<Trip>): Trip | undefined {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    const updated = { ...trip, ...updates };
    this.trips.set(id, updated);
    return updated;
  }

  // OTP
  saveOtp(record: OtpRecord): void {
    this.otps.set(record.phone, record);
  }

  getOtp(phone: string): OtpRecord | undefined {
    return this.otps.get(phone);
  }

  deleteOtp(phone: string): void {
    this.otps.delete(phone);
  }
}

export const db = new InMemoryDatabase();
