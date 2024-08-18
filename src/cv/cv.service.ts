import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CVService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadFile(file: any, userId: string) {
    const filePath = join(process.env.FILE_PATH, file.filename); // Path relative to the project root

    // Update the user's fileUrl field with the uploaded file path
    return this.prismaService.user.update({
      where: { id: userId },
      data: { fileUrl: filePath },
    });
  }

  async getUserFiles(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { fileUrl: true },
    });

    return user?.fileUrl
      ? { fileUrl: user.fileUrl }
      : { message: 'No files uploaded' };
  }

  async getAllFiles() {
    try {
      // const uploadsDir = join('uploads'); // Path relative to the project root
      // const files = fs.readdirSync(uploadsDir);

      const users = await this.prismaService.user.findMany({
        select: { fileUrl: true, name: true, id: true, email: true },
      });

      // Create an array of file names with their full paths
      return users.filter((user: any) => user.fileUrl);
    } catch (error) {
      throw new Error('Error retrieving files: ' + error.message);
    }
  }
}
