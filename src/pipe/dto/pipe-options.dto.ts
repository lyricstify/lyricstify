import { SyncType } from '../../player/types/sync-type.type.js';

export class PipeOptionsDto {
  romaji: boolean;
  translateTo: string | false;
  delay: number;
  syncType: SyncType;

  constructor({ romaji, translateTo, delay, syncType }: PipeOptionsDto) {
    this.romaji = romaji;
    this.translateTo = translateTo;
    this.delay = delay;
    this.syncType = syncType;
  }
}
