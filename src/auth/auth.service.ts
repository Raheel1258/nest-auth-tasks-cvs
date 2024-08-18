// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenUtil } from 'src/utils/token.util';
import { PrismaService } from '../../prisma/prisma.service'; // Correct path for PrismaService

// const {PrismaService}=require('../../prisma/prisma.module')

@Injectable()
export class AuthService {
  private tokenUtil: TokenUtil;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.tokenUtil = new TokenUtil(this.jwtService, this.prisma);
  }

  // Mock user data (replace with database model, e.g., using Prisma)

  // Sign-up function
  async signUp(email: string, password: string, name: string) {
    if (!email || !password) {
      return {
        responseStatus: 0,
        message: 'Email and password are required',
      };
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { responseStatus: 0, message: 'User already exists' };
    }
    const { accessToken, refreshToken } = this.tokenUtil.generateToken(email); // Use the TokenUtil

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
        accessToken,
        refreshToken,
      },
    });

    return {
      responseStatus: 1,
      response: user,
      message: 'SignUp Succesfull',
    };
  }

  // Sign-in function
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { responseStatus: 0, message: 'Invalid email or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { responseStatus: 0, message: 'Invalid email or password' };
    }

    const { accessToken, refreshToken } = this.tokenUtil.generateToken(email); // Generate new tokens
    return {
      response: user,
      responseStatus: 1,
      accessToken,
      refreshToken,
      message: 'Login Successful',
    };
  }
}
