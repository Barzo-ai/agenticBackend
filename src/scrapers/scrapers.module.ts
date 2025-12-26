/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AmazonService } from './amazon/amazon.service';
import { JumiaService } from './jumia/jumia.service';
import { KongaService } from './konga/konga.service';

@Module({
  providers: [AmazonService, JumiaService, KongaService],
  
})
export class ScrapersModule {}
