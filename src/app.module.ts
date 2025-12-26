/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ScrapersModule } from './scrapers/scrapers.module';
import { QueueModule } from './queue/queue.module';
import { ProductsModule } from './products/products.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    AiModule,
    ScrapersModule,
    QueueModule,
    ProductsModule,
    UtilsModule,
    ConfigModule.forRoot({
      isGlobal: true, // 👈 REQUIRED
      envFilePath: '.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
