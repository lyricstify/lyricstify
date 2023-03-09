import { LineResponseInterface } from '../../lyric/interfaces/line-response.interface.js';

export class CurrentlyPlayingState {
  isActive: boolean;
  isPlaying: boolean;
  progress: number;
  type: SpotifyApi.CurrentlyPlayingObject['currently_playing_type'] | null;
  trackId: string | null;
  lyrics: LineResponseInterface[];
  isLyricModified: boolean;
  timestamp: number;
  activeLyricIndex: number | null;

  constructor({
    isActive = false,
    isPlaying = false,
    progress = 0,
    type = null,
    trackId = null,
    lyrics = [],
    isLyricModified = false,
    timestamp = new Date().getTime(),
    activeLyricIndex = null,
  }: Partial<
    Omit<CurrentlyPlayingState, 'getCurrentLyricIndex' | 'nextLyric'>
  >) {
    this.isActive = isActive;
    this.isPlaying = isPlaying;
    this.progress = progress;
    this.type = type;
    this.trackId = trackId;
    this.lyrics = lyrics;
    this.isLyricModified = isLyricModified;
    this.timestamp = timestamp;
    this.activeLyricIndex = activeLyricIndex;
  }

  getCurrentLyricIndex(progress: number) {
    const lastLyric = this.lyrics.at(-1);

    if (lastLyric !== undefined && progress > lastLyric.startTimeMs) {
      return this.lyrics.length - 1;
    }

    const index = this.lyrics?.findIndex(
      (lyric) => lyric.startTimeMs > progress,
    );

    return index === -1 ? null : index - 1;
  }

  nextLyric(): { index: number; value: LineResponseInterface } | null {
    if (this.activeLyricIndex === null) {
      return null;
    }

    const currentLyric = this.lyrics.at(this.activeLyricIndex);

    if (
      this.activeLyricIndex === this.lyrics.length - 1 &&
      currentLyric !== undefined
    ) {
      return {
        index: this.activeLyricIndex,
        value: currentLyric,
      };
    }

    const nextLyricIndex = this.activeLyricIndex + 1;
    const nextLyric = this.lyrics.at(nextLyricIndex);

    return nextLyric === undefined
      ? null
      : { index: nextLyricIndex, value: nextLyric };
  }
}
