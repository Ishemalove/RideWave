import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [DriversController],
  providers: [DriversService, AuthService],
})
export class DriversModule {}
