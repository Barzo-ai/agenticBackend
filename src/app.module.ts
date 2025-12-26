import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ScrapersModule } from './scrapers/scrapers.module';
import { QueueModule } from './queue/queue.module';
import { ProductsModule } from './products/products.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [AiModule, ScrapersModule, QueueModule, ProductsModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
