import { Injectable } from '@nestjs/common';
import {
  combineLatest,
  concatMap,
  EMPTY,
  map,
  Observable,
  of,
  scan,
} from 'rxjs';
import terminalKit from 'terminal-kit';
import { ObservableRunner } from '../../common/interfaces/observable-runner.interface.js';
import {
  pipeline,
  PipelineFunction,
} from '../../common/utils/pipeline.util.js';
import { GraduallyUpdateProgressObservable } from '../../player/observables/gradually-update-progress.observable.js';
import { PollCurrentlyPlayingObservable } from '../../player/observables/poll-currently-playing.observable.js';
import { CurrentlyPlayingState } from '../../player/states/currently-playing.state.js';
import { ResizeEventObservable } from '../../terminal-kit/observables/resize-event.observable.js';
import { TerminalSizeState } from '../../terminal-kit/states/terminal-size.state.js';
import { AdjustmentLyricsDto } from '../../transformation/dto/adjustment-lyrics.dto.js';
import { AdjustmentPipeFunction } from '../../transformation/interfaces/adjustment-pipe-function.interface.js';
import { InitializationPipeFunction } from '../../transformation/interfaces/initialization-pipe-function.interface.js';
import { UpdateProgressPipeFunction } from '../../transformation/interfaces/update-progress-pipe-function.interface.js';
import { PlayerTerminalState } from '../states/player-terminal.state.js';
import { TerminalContentState } from '../states/terminal-content.state.js';

interface RunOptions {
  terminal: terminalKit.Terminal;
  delay: number;
  initializationPipes: InitializationPipeFunction[];
  adjustmentPipes: AdjustmentPipeFunction[];
  updateProgressPipes: UpdateProgressPipeFunction[];
}

@Injectable()
export class StartOrchestraObservable implements ObservableRunner {
  constructor(
    private readonly pollCurrentlyPlaying: PollCurrentlyPlayingObservable,
    private readonly graduallyUpdateProgress: GraduallyUpdateProgressObservable,
    private readonly terminalResizeEvent: ResizeEventObservable,
  ) {}

  run({
    terminal,
    delay,
    initializationPipes,
    adjustmentPipes,
    updateProgressPipes,
  }: RunOptions) {
    const lyricsAdjustmentPipes = pipeline(...adjustmentPipes);
    const lyricsUpdateProgressPipes = pipeline(...updateProgressPipes);

    const pollCurrentlyPlaying$ = this.pollCurrentlyPlaying.run({
      delay,
      initializationPipes,
    });
    const graduallyUpdateProgress$ = this.graduallyUpdateProgress.run({
      pollCurrentlyPlaying$,
    });
    const terminalResizeEvent$ = this.terminalResizeEvent.run({ terminal });

    return combineLatest([
      pollCurrentlyPlaying$,
      graduallyUpdateProgress$,
      terminalResizeEvent$,
    ]).pipe(
      concatMap(this.skipEmitsToObserversIfUnchanged$),
      scan(
        this.updateStateAndAdjustLyricsIfChanged$(lyricsAdjustmentPipes),
        new AdjustmentLyricsDto({}),
      ),
      map(lyricsUpdateProgressPipes),
      map(this.convertToTerminalContentState),
    );
  }

  private skipEmitsToObserversIfUnchanged$([
    currentlyPlayingState1,
    currentlyPlayingState2,
    terminalSizeState,
  ]: [
    CurrentlyPlayingState,
    CurrentlyPlayingState,
    TerminalSizeState,
  ]): Observable<PlayerTerminalState> {
    if (
      currentlyPlayingState1.activeLyricIndex ===
        currentlyPlayingState2.activeLyricIndex &&
      terminalSizeState.isResized === false
    ) {
      return EMPTY;
    }

    const currentlyPlayingState =
      currentlyPlayingState1.timestamp > currentlyPlayingState2.timestamp
        ? currentlyPlayingState1
        : currentlyPlayingState2;

    return of({ currentlyPlayingState, terminalSizeState });
  }

  private updateStateAndAdjustLyricsIfChanged$(
    pipes: PipelineFunction<AdjustmentLyricsDto>,
  ) {
    return (
      acc: AdjustmentLyricsDto,
      { currentlyPlayingState, terminalSizeState }: PlayerTerminalState,
    ) => {
      if (
        currentlyPlayingState.isLyricModified === true ||
        terminalSizeState.isResized === true
      ) {
        return pipes({
          lyrics: currentlyPlayingState.lyrics.map((lyric) =>
            lyric.words.split('\n'),
          ),
          options: {
            activeLyricIndex: currentlyPlayingState.activeLyricIndex,
            maxHeight: terminalSizeState.height,
            maxWidth: terminalSizeState.width,
          },
        });
      }

      return acc;
    };
  }

  private convertToTerminalContentState({
    lyrics,
    options,
  }: AdjustmentLyricsDto) {
    return new TerminalContentState({
      content: lyrics.flatMap((lyric) => lyric).join('\n'),
      cursor: options.activeLyricIndex || 0,
    });
  }
}
