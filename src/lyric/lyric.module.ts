import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LyricService } from './lyric.service.js';

@Module({
  imports: [HttpModule],
  providers: [LyricService],
  exports: [LyricService],
})
export class LyricModule {}
