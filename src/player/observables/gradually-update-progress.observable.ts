import { Injectable } from '@nestjs/common';
import { concatMap, EMPTY, map, Observable, of, withLatestFrom } from 'rxjs';
import {
  RepeatConfig,
  repeatWith,
} from '../../common/rxjs/operators/repeat-with.operator.js';
import { sharedPairwise } from '../../common/rxjs/operators/shared-pairwise.operator.js';
import { ObservableRunner } from '../../common/interfaces/observable-runner.interface.js';
import { sharedScan } from '../../common/rxjs/operators/shared-scan.operator.js';
import { CurrentlyPlayingState } from '../states/currently-playing.state.js';
import { ConfigService } from '../../config/config.service.js';

interface RunOptions {
  pollCurrentlyPlaying$: Observable<CurrentlyPlayingState>;
}

@Injectable()
export class GraduallyUpdateProgressObservable implements ObservableRunner {
  constructor(private readonly configService: ConfigService) {}

  run({ pollCurrentlyPlaying$ }: RunOptions) {
    return of({}).pipe(
      withLatestFrom(pollCurrentlyPlaying$),
      map(this.removeUnusedInitialValue),
      sharedScan(this.updateActiveLyricsState, new CurrentlyPlayingState({})),
      repeatWith(this.repeatAfterDelayBetweenCurrentAndNextLyrics.bind(this)),
      sharedPairwise(),
      concatMap(this.skipEmitsToObserversIfUnchanged$),
    );
  }

  private removeUnusedInitialValue([, value]: [object, CurrentlyPlayingState]) {
    return value;
  }

  private updateActiveLyricsState(
    acc: CurrentlyPlayingState,
    val: CurrentlyPlayingState,
  ) {
    if (acc.timestamp === val.timestamp) {
      const nextLyric = acc.nextLyric();

      return new CurrentlyPlayingState({
        ...acc,
        activeLyricIndex: nextLyric && nextLyric.index,
        progress: nextLyric?.value.startTimeMs ?? 0,
      });
    }

    const progress = val.progress + new Date().getTime() - val.timestamp;
    const activeLyricIndex = val.currentLyricIndexByProgressTime(progress);

    return new CurrentlyPlayingState({
      ...val,
      activeLyricIndex,
      progress,
    });
  }

  private repeatAfterDelayBetweenCurrentAndNextLyrics(
    val: CurrentlyPlayingState,
  ): RepeatConfig {
    const nextLyric = val.nextLyric();

    if (
      val.isActive === false ||
      val.isPlaying === false ||
      nextLyric === null
    ) {
      return { delay: this.configService.retryDelay };
    }

    const intervalWithNextLyric = nextLyric.value.startTimeMs - val.progress;
    const delay =
      intervalWithNextLyric <= 0
        ? this.configService.retryDelay
        : intervalWithNextLyric;

    return { delay };
  }

  private skipEmitsToObserversIfUnchanged$([prev, current]: [
    CurrentlyPlayingState | undefined,
    CurrentlyPlayingState,
  ]) {
    if (
      (prev?.isActive === false && current.isActive === false) ||
      (prev?.isPlaying === false && current.isPlaying === false) ||
      prev?.activeLyricIndex === current.activeLyricIndex
    ) {
      return EMPTY;
    }

    return of(current);
  }
}
