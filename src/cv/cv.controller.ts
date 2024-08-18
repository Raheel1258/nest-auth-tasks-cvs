import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { TokenUtil } from '../utils/token.util';
import { CVService } from './cv.service';

@Controller('files')
export class CVController {
  constructor(
    private readonly cvService: CVService,
    private readonly tokenUtil: TokenUtil,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') authorization: string,
    @Res() res: Response,
  ) {
    try {
      const userId = await this.tokenUtil.getUserIdFromToken(authorization);
      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ responseStatus: 0, message: 'Unauthorized' });
      }

      const savedFile = await this.cvService.uploadFile(file, userId);
      return res
        .status(HttpStatus.CREATED)
        .json({ response:savedFile, responseStatus: 1 });
    } catch (error) {
      console.error(error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ responseStatus: 0, message: 'Error uploading file' });
    }
  }

  @Get('user-files')
  async getUserFiles(
    @Headers('Authorization') authorization: string,
    @Res() res: Response,
  ) {
    try {
      const userId = await this.tokenUtil.getUserIdFromToken(authorization);
      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ responseStatus: 0, message: 'Unauthorized' });
      }

      const files = await this.cvService.getUserFiles(userId);
      return res
        .status(HttpStatus.OK)
        .json({ response: files, responseStatus: 1 });
    } catch (error) {
      console.error(error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ responseStatus: 0, message: 'Error retrieving files' });
    }
  }

  @Get('all-files')
  async getAllFiles(@Res() res: Response) {
    try {
      const files = await this.cvService.getAllFiles();
      return res
        .status(HttpStatus.OK)
        .json({ response: files, responseStatus: 1});
    } catch (error) {
      console.error(error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error retrieving files' });
    }
  }
}
