import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('createTask')
  async createTask(
    @Body('description') description: string,
    @Body('title') title: string,
    @Headers('Authorization') authorization: string,
    @Body('status') status: string,
    @Res() res: Response,
  ) {
    const result = await this.taskService.createTask(
      description,
      title,
      authorization,
      status,
    );
    if (result.responseStatus === 1) {
      return res.status(HttpStatus.CREATED).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }
  @Get('getUserTasks')
  async getTasksForUser(
    @Headers('Authorization') authorization: string,
    @Res() res: Response,
  ) {
    const result = await this.taskService.getTasksForUser(authorization);
    if (result.responseStatus === 1) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }
}
