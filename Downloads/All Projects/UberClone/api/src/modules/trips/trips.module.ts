import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [TripsController],
  providers: [TripsService, AuthService],
})
export class TripsModule {}
