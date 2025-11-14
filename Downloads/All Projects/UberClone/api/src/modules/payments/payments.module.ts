import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, AuthService],
})
export class PaymentsModule {}
