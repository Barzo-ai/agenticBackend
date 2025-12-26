/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AiService],
  exports: [AiService],
  imports: [ConfigModule],
})
export class AiModule {}
