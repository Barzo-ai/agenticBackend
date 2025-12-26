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
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'scraping2',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AiModule,
    ConfigModule,
  ],
})
export class ProductsModule { }
