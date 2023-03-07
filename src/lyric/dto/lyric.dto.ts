import { LineResponseInterface } from '../interfaces/line-response.interface.js';
import { LyricResponseInterface } from '../interfaces/lyric-response.interface.js';

export class LyricDto {
  lines: LineResponseInterface[];
  syncType: LyricResponseInterface['syncType'];

  constructor({ lines, syncType }: LyricDto) {
    this.lines = lines;
    this.syncType = syncType;
  }
}
