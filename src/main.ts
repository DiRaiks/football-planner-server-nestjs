import { NestFactory } from '@nestjs/core';
import * as RateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

const rateLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const registrationLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 100 requests per windowMs
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(rateLimiter);
  app.use('/auth/registration', registrationLimiter);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
