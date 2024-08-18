import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenUtil } from '../utils/token.util';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenUtil: TokenUtil,
  ) {}

  async createTask(description: string, title: string, authorization: string, status: string) {
    try {
      const userId = await this.tokenUtil.getUserIdFromToken(authorization);

      if (!userId) {
        return {
          responseStatus: 0,
          message: 'User does not exit',
        };
      }

      // Verify if the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          responseStatus: 0,
          message: 'User not found',
        };
      }

      // Create the task for the user
      else if (user) {
        const task = await this.prisma.task.create({
          data: {
            title,
            userId,
            createdAt: new Date(),
            description,
            status,
          },
        });

        return {
          responseStatus: 1,
          response:task,
          message: 'Task created successfully',
        };
      }
    } catch (error) {
      console.error('Error creating task:', error);
      return {
        responseStatus: 0,
        message: 'Invalid token or error occurred',
      };
    }
  }
  async getTasksForUser(authorization: string) {
    try {
      const userId = await this.tokenUtil.getUserIdFromToken(authorization);
      if (!userId) {
        return {
          responseStatus: 0,
          message: 'User does not exist or token is invalid',
        };
      }

      // Fetch tasks for the user
      const tasks = await this.prisma.task.findMany({
        where: { userId: userId },
      });

      return {
        responseStatus: 1,
        response:tasks,
        message: 'Tasks retrieved successfully',
      };
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return {
        responseStatus: 1,
        message: 'Error occurred while retrieving tasks',
      };
    }
  }
}
