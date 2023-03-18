import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module.js';
import { LyricService } from './lyric.service.js';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [LyricService],
  exports: [LyricService],
})
export class LyricModule {}
