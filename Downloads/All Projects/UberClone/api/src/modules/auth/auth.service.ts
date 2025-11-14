import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'dev-secret-key';
  private readonly jwtExpiresIn = '7d';
  private readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.refreshTokenSecret, {
      expiresIn: '30d',
    });
  }

  verifyAccessToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, this.jwtSecret) as {
        userId: string;
        role: string;
      };
    } catch {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
