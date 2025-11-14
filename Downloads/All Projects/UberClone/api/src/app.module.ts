import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TripsModule } from './modules/trips/trips.module';
import { DriversModule } from './modules/drivers/drivers.module';

@Module({
  imports: [AuthModule, TripsModule, DriversModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
