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

interface RunOptions {
  pollCurrentlyPlaying$: Observable<CurrentlyPlayingState>;
}

@Injectable()
export class GraduallyUpdateProgressObservable implements ObservableRunner {
  run({ pollCurrentlyPlaying$ }: RunOptions) {
    return of({}).pipe(
      withLatestFrom(pollCurrentlyPlaying$),
      map(this.removeUnusedInitialValue),
      sharedScan(this.updateTrackState, new CurrentlyPlayingState({})),
      sharedPairwise(),
      concatMap(this.skipEmitsToObserversIfUnchanged$),
      repeatWith(
        this.repeatAfterDelayBetweenCurrentAndNextLyrics({
          defaultDelay: 1000,
        }),
      ),
    );
  }

  private removeUnusedInitialValue([, value]: [object, CurrentlyPlayingState]) {
    return value;
  }

  private updateTrackState(
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

    return val;
  }

  private skipEmitsToObserversIfUnchanged$([prev, current]: [
    CurrentlyPlayingState | undefined,
    CurrentlyPlayingState,
  ]) {
    if (
      (prev?.isActive === false && current.isActive === false) ||
      (prev?.isPlaying === false && current.isPlaying === false) ||
      (prev?.activeLyricIndex === null && current.activeLyricIndex === null) ||
      (prev?.progress === 0 && current.progress === 0)
    ) {
      return EMPTY;
    }

    return of(current);
  }

  private repeatAfterDelayBetweenCurrentAndNextLyrics({
    defaultDelay,
  }: {
    defaultDelay: number;
  }) {
    return (val: CurrentlyPlayingState): RepeatConfig => {
      const nextLyric = val.nextLyric();

      if (
        val.isActive === false ||
        val.isPlaying === false ||
        nextLyric === null
      ) {
        return { delay: defaultDelay };
      }

      const intervalWithNextLyric = nextLyric.value.startTimeMs - val.progress;
      const delay =
        intervalWithNextLyric <= 0 ? defaultDelay : intervalWithNextLyric;

      return { delay: delay };
    };
  }
}
