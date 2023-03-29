import { SyncType } from '../../player/types/sync-type.type.js';
import { RomanizationProviderChoicesType } from '../../transformation/types/romanization-provider-choices.type.js';

export class PipeOptionsDto {
  romanize: boolean;
  romanizationProvider: RomanizationProviderChoicesType;
  translateTo: string | false;
  delay: number;
  syncType: SyncType;

  constructor({
    romanize,
    romanizationProvider,
    translateTo,
    delay,
    syncType,
  }: PipeOptionsDto) {
    this.romanize = romanize;
    this.romanizationProvider = romanizationProvider;
    this.translateTo = translateTo;
    this.delay = delay;
    this.syncType = syncType;
  }
}
