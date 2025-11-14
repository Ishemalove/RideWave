import { IsNotEmpty, IsLatitude, IsLongitude, IsEnum } from 'class-validator';
import { VehicleType } from '../../common/types';

export class EstimateDto {
  @IsNotEmpty()
  @IsLatitude()
  pickupLat: number;

  @IsNotEmpty()
  @IsLongitude()
  pickupLng: number;

  @IsNotEmpty()
  @IsLatitude()
  dropoffLat: number;

  @IsNotEmpty()
  @IsLongitude()
  dropoffLng: number;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}

export class CreateTripDto {
  @IsNotEmpty()
  @IsLatitude()
  pickupLat: number;

  @IsNotEmpty()
  @IsLongitude()
  pickupLng: number;

  @IsNotEmpty()
  @IsLatitude()
  dropoffLat: number;

  @IsNotEmpty()
  @IsLongitude()
  dropoffLng: number;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  paymentMethodId?: string;
  promoCode?: string;
}
