import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [AdminController],
  providers: [AuthService],
})
export class AdminModule {}
