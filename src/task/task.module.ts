import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'prisma/prisma.module';
import { TokenUtil } from 'src/utils/token.util';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the import path as needed
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Use environment variable for secret key in production
      signOptions: { expiresIn: '24d' },
    }),
    PrismaModule, // Import PrismaModule
  ],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, TokenUtil],
})
export class TaskModule {}
