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
          // tls: {},
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'scraping',
      // connection: {
      //   // url: process.env.REDIS_HOST || 'localhost',
      //   // port: parseInt(process.env.REDIS_PORT || '6379'),
      //   host: 'redis.railway.internal',
      //   port: 6379,
      //   username: 'default',
      //   password: 'DXALtgHTcLRmtrsRANoUkHQWfDhVuZpX'
      // },
    }),
    BullModule.registerQueue({
      name: 'scraping2',
      // connection: {
      //   // url: process.env.REDIS_HOST || 'localhost',
      //   // port: parseInt(process.env.REDIS_PORT || '6379'),
      //   host: 'redis.railway.internal',
      //   port: 6379,
      //   username: 'default',
      //   password: 'DXALtgHTcLRmtrsRANoUkHQWfDhVuZpX'
      // },
    }),
    AiModule,
    ConfigModule,
  ],
})
export class ProductsModule { }
