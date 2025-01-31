import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors();

  await app.listen(8080, () => {
    console.log('Server running on port 8080');
  });
}
bootstrap();
