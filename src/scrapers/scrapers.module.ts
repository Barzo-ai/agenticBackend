import { Module } from '@nestjs/common';
import { AmazonService } from './amazon/amazon.service';

@Module({
  providers: [AmazonService]
})
export class ScrapersModule {}
