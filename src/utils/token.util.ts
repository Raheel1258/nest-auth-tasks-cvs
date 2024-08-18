import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async getUserIdFromToken(authorization: string): Promise<string> {
    if (!authorization || !authorization.startsWith('Bearer')) {
      return null;
    }
    const token = authorization.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user?.id;
    } catch (error) {
      console.error(error.message);
      return;
    }
  }

  generateToken(email: string): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign({ email }, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign({ email }, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
