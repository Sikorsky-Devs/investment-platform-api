import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { AuthGuard } from './guard/auth.guard';
import { TokenResponse } from './response/token.response';
import { UserResponse } from '../user/response/user.response';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/email-approve/:token')
  async approveEmail(@Param('token') token: string): Promise<TokenResponse> {
    return { token: await this.authService.approveEmail(token) };
  }

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<TokenResponse> {
    return { token: await this.authService.signIn(signInDto) };
  }

  @Post('/email-resend')
  async sendEmail(@Body('email') email: string): Promise<void> {
    return this.authService.resendEmail(email);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getCurrentUser(@Req() req: Request): UserResponse {
    return req['user'];
  }
}
