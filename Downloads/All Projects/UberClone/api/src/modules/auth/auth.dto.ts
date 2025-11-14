import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  phoneOrEmail: string;

  @IsNotEmpty()
  password: string;
}

export class SendOtpDto {
  @IsPhoneNumber()
  phone: string;
}

export class VerifyOtpDto {
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  code: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
