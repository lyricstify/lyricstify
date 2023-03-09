import { Injectable } from '@nestjs/common';
import { combineLatest, concatMap, EMPTY, Observable, of } from 'rxjs';
import { ObservableRunner } from '../../common/interfaces/observable-runner.interface.js';
import { GraduallyUpdateProgressObservable } from '../../player/observables/gradually-update-progress.observable.js';
import { PollCurrentlyPlayingObservable } from '../../player/observables/poll-currently-playing.observable.js';
import { CurrentlyPlayingState } from '../../player/states/currently-playing.state.js';
import { InitializationPipeFunction } from '../../transformation/interfaces/initialization-pipe-function.interface.js';
import { ContentState } from '../states/content.state.js';

interface RunOptions {
  delay: number;
  initializationPipes: InitializationPipeFunction[];
}

@Injectable()
export class PipeOrchestraObservable implements ObservableRunner {
  constructor(
    private readonly pollCurrentlyPlaying: PollCurrentlyPlayingObservable,
    private readonly graduallyUpdateProgress: GraduallyUpdateProgressObservable,
  ) {}

  run({ delay, initializationPipes }: RunOptions) {
    const pollCurrentlyPlaying$ = this.pollCurrentlyPlaying.run({
      delay,
      initializationPipes,
    });
    const graduallyUpdateProgress$ = this.graduallyUpdateProgress.run({
      pollCurrentlyPlaying$,
    });

    return combineLatest([
      pollCurrentlyPlaying$,
      graduallyUpdateProgress$,
    ]).pipe(concatMap(this.skipEmitsToObserversIfUnchanged$));
  }

  private skipEmitsToObserversIfUnchanged$([
    currentlyPlayingState1,
    currentlyPlayingState2,
  ]: [CurrentlyPlayingState, CurrentlyPlayingState]): Observable<ContentState> {
    if (
      currentlyPlayingState1.activeLyricIndex ===
      currentlyPlayingState2.activeLyricIndex
    ) {
      return EMPTY;
    }

    const currentlyPlayingState =
      currentlyPlayingState1.timestamp > currentlyPlayingState2.timestamp
        ? currentlyPlayingState1
        : currentlyPlayingState2;

    const content = (() => {
      if (currentlyPlayingState.activeLyricIndex === null) {
        return '';
      }

      const activeLyrics = currentlyPlayingState.lyrics.at(
        currentlyPlayingState.activeLyricIndex,
      );

      return activeLyrics?.words || '';
    })();

    return of(new ContentState({ content }));
  }
}
