/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AiModule } from 'src/ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
    BullModule.registerQueue({
      name: 'scraping',
      connection: {
        url: process.env.REDIS_URL || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'scraping2',
      connection: {
        url: process.env.REDIS_URL || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    AiModule,
    ConfigModule,
  ],
})
export class ProductsModule { }
