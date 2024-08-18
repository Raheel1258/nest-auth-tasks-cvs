// src/auth/auth.controller.ts
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.signUp(email, password, name);
    if (result.responseStatus === 1) {
      return res.status(HttpStatus.CREATED).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        responseStatus: 0,
        message: 'Email and password are required',
      });
    }
    const result = await this.authService.login(email, password);
    if (result.responseStatus === 1) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(result);
    }
  }
}
