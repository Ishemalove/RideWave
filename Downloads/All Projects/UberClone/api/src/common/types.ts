// Shared types and enums

export enum UserRole {
  RIDER = 'rider',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum TripStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  ENROUTE = 'enroute',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum VehicleType {
  ECONOMY = 'economy',
  XL = 'xl',
  PREMIUM = 'premium',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Driver extends User {
  licenseNo: string;
  vehicleId?: string;
  ratingAvg: number;
  docsStatus: 'pending' | 'approved' | 'rejected';
  bankDetailsId?: string;
  isOnline: boolean;
  currentLocation?: { lat: number; lng: number };
}

export interface Trip {
  id: string;
  riderId: string;
  driverId?: string;
  pickupPoint: { lat: number; lng: number };
  dropoffPoint: { lat: number; lng: number };
  vehicleType: VehicleType;
  fareEstimate: number;
  fareFinal?: number;
  status: TripStatus;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}
