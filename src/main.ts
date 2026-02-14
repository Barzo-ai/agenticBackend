/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from "cors"
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  // const corsOptions = {
  //   origin: '*',
  //   credentials: true,
  //   optionSuccessStatus: 200,
  // };

  // app.use(cors(corsOptions));

  // Use NestJS's built-in CORS
  app.enableCors({
    origin: '*', // Be more specific than '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
