import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuthService } from './auth.service';
import { db } from '../../common/database';
import {
  SignupDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  RefreshTokenDto,
} from './auth.dto';
import { User, UserRole, OtpRecord } from '../../common/types';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    // Check if user already exists
    if (db.findUserByEmail(dto.email) || db.findUserByPhone(dto.phone)) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.authService.hashPassword(dto.password);
    const user: User = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: UserRole.RIDER,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    db.createUser(user);

    const accessToken = this.authService.generateAccessToken(user.id, user.role);
    const refreshToken = this.authService.generateRefreshToken(user.id);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user =
      db.findUserByEmail(dto.phoneOrEmail) ||
      db.findUserByPhone(dto.phoneOrEmail);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.authService.comparePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.authService.generateAccessToken(user.id, user.role);
    const refreshToken = this.authService.generateRefreshToken(user.id);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  @Post('otp/send')
  @HttpCode(200)
  sendOtp(@Body() dto: SendOtpDto) {
    const code = this.authService.generateOtpCode();
    const otpRecord: OtpRecord = {
      phone: dto.phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      attempts: 0,
    };
    db.saveOtp(otpRecord);

    // TODO: Send SMS via Twilio/MessageBird
    console.log(`[DEV] OTP for ${dto.phone}: ${code}`);

    return { message: 'OTP sent', phone: dto.phone };
  }

  @Post('otp/verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const otpRecord = db.getOtp(dto.phone);

    if (!otpRecord) {
      throw new BadRequestException('OTP not found or expired');
    }

    if (new Date() > otpRecord.expiresAt) {
      db.deleteOtp(dto.phone);
      throw new BadRequestException('OTP expired');
    }

    if (otpRecord.code !== dto.code) {
      otpRecord.attempts++;
      if (otpRecord.attempts > 3) {
        db.deleteOtp(dto.phone);
        throw new UnauthorizedException('Too many attempts');
      }
      throw new BadRequestException('Invalid OTP');
    }

    db.deleteOtp(dto.phone);

    // Find or create user (for OTP-only login)
    let user = db.findUserByPhone(dto.phone);
    if (!user) {
      user = {
        id: randomUUID(),
        name: '',
        email: '',
        phone: dto.phone,
        role: UserRole.RIDER,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      db.createUser(user);
    }

    const accessToken = this.authService.generateAccessToken(user.id, user.role);
    const refreshToken = this.authService.generateRefreshToken(user.id);

    return {
      userId: user.id,
      phone: user.phone,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    // Parse refresh token to extract userId (simplified, no full verification here)
    try {
      const decoded = JSON.parse(
        Buffer.from(dto.refreshToken.split('.')[1], 'base64').toString(),
      );
      const user = db.getUserById(decoded.userId);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.authService.generateAccessToken(
        user.id,
        user.role,
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
