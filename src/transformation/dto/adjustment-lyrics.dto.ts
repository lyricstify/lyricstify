import { CurrentlyPlayingState } from '../../player/states/currently-playing.state.js';

export class AdjustmentLyricsDto {
  lyrics: string[][];
  options: {
    maxWidth: number;
    maxHeight: number;
    activeLyricIndex: CurrentlyPlayingState['activeLyricIndex'];
  };

  constructor({
    lyrics = [],
    options = { maxWidth: 0, maxHeight: 0, activeLyricIndex: null },
  }: Partial<AdjustmentLyricsDto>) {
    this.lyrics = lyrics;
    this.options = options;
  }
}
