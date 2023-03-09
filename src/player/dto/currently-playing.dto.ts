import { PickType } from '@nestjs/mapped-types';
import { CurrentlyPlayingState } from '../states/currently-playing.state.js';

export class CurrentlyPlayingDto extends PickType(CurrentlyPlayingState, [
  'type',
  'trackId',
  'timestamp',
  'isActive',
  'isPlaying',
  'progress',
]) {
  constructor({
    type,
    trackId,
    timestamp,
    isActive,
    isPlaying,
    progress,
  }: CurrentlyPlayingDto) {
    super();

    this.type = type;
    this.trackId = trackId;
    this.timestamp = timestamp;
    this.isActive = isActive;
    this.isPlaying = isPlaying;
    this.progress = progress;
  }
}
