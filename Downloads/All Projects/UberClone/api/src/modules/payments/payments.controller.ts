import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { db } from '../../common/database';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('intents')
  @UseGuards(JwtGuard)
  async createPaymentIntent(
    @Body() dto: { amount: number; tripId: string },
    @Request() req: any,
  ) {
    const trip = db.getTripById(dto.tripId);
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    const intent = await this.paymentsService.createPaymentIntent(
      dto.amount,
      'USD',
    );

    return {
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      amount: intent.amount,
    };
  }

  @Post('confirm')
  @UseGuards(JwtGuard)
  async confirmPayment(
    @Body()
    dto: {
      paymentIntentId: string;
      paymentMethodId: string;
      tripId: string;
    },
    @Request() req: any,
  ) {
    const trip = db.getTripById(dto.tripId);
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    const result = await this.paymentsService.confirmPayment(
      dto.paymentIntentId,
      dto.paymentMethodId,
    );

    // Create payment record
    // TODO: Persist to DB
    return {
      status: result.status,
      amount: result.amount,
      tripId: dto.tripId,
    };
  }

  @Post('refund')
  @UseGuards(JwtGuard)
  async refund(
    @Body() dto: { chargeId: string; amount?: number },
    @Request() req: any,
  ) {
    const result = await this.paymentsService.refundPayment(
      dto.chargeId,
      dto.amount,
    );

    return {
      refundId: result.id,
      status: result.status,
      amount: result.amount,
    };
  }
}
