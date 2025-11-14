// Unit tests for auth service

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should generate and verify access token', () => {
    const token = service.generateAccessToken('user-123', 'rider');
    const payload = service.verifyAccessToken(token);

    expect(payload?.userId).toBe('user-123');
    expect(payload?.role).toBe('rider');
  });

  it('should generate OTP code', () => {
    const otp = service.generateOtpCode();
    expect(otp).toMatch(/^\d{6}$/);
  });

  it('should hash and compare passwords', async () => {
    const password = 'test-password-123';
    const hash = await service.hashPassword(password);
    const isValid = await service.comparePassword(password, hash);

    expect(isValid).toBe(true);
  });
});
