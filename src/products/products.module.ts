/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AiModule } from 'src/ai/ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_URL'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'scraping',
    }),
    BullModule.registerQueue({
      name: 'scraping2',
    }),
    AiModule,
    ConfigModule,
  ],
})
export class ProductsModule { }
