import { Injectable } from '@nestjs/common';
import {
  BehaviorSubject,
  concatMap,
  EMPTY,
  from,
  map,
  mergeMap,
  MonoTypeOperatorFunction,
  of,
  repeat,
  share,
  ShareConfig,
} from 'rxjs';
import { LyricService } from '../../lyric/lyric.service.js';
import { ObservableRunner } from '../../common/interfaces/observable-runner.interface.js';
import { sharedPairwise } from '../../common/rxjs/operators/shared-pairwise.operator.js';
import { PlayerService } from '../player.service.js';
import { CurrentlyPlayingDto } from '../dto/currently-playing.dto.js';
import { CurrentlyPlayingState } from '../states/currently-playing.state.js';
import { sharedScan } from '../../common/rxjs/operators/shared-scan.operator.js';
import { InitializationPipeFunction } from '../../transformation/interfaces/initialization-pipe-function.interface.js';
import { LineResponseInterface } from '../../lyric/interfaces/line-response.interface.js';

interface RunOptions {
  delay: number;
  initializationPipes: InitializationPipeFunction[];
}

@Injectable()
export class PollCurrentlyPlayingObservable implements ObservableRunner {
  constructor(
    private readonly playerService: PlayerService,
    private readonly lyricService: LyricService,
  ) {}

  run({ delay, initializationPipes }: RunOptions) {
    const lyricsInitializationPipes = initializationPipes.map((pipe) =>
      mergeMap(pipe),
    );

    return of({}).pipe(
      concatMap(() => from(this.playerService.currentlyPlaying())),
      sharedPairwise(),
      concatMap(this.generateTrackState$(lyricsInitializationPipes)),
      sharedScan(this.updateTrackState, new CurrentlyPlayingState({})),
      repeat({ delay }),
      share(this.createSharedSubjectConfiguration()),
    );
  }

  private generateTrackState$(
    pipes: MonoTypeOperatorFunction<LineResponseInterface[]>[],
  ) {
    return ([prev, current]: [
      CurrentlyPlayingDto | undefined,
      CurrentlyPlayingDto,
    ]) => {
      switch (true) {
        case prev?.trackId === current.trackId &&
          prev.progress === current.progress &&
          prev.isPlaying === current.isPlaying:
          return EMPTY;

        case current.trackId === null || current.isActive === false:
          return of(
            new CurrentlyPlayingState({
              ...current,
              lyrics: [],
              isLyricModified: true,
            }),
          );

        case prev?.trackId === current.trackId:
          return of(
            new CurrentlyPlayingState({
              ...current,
              lyrics: [],
              isLyricModified: false,
            }),
          );

        default:
          return from(
            this.lyricService.findOne(current.trackId as string),
          ).pipe(
            concatMap(({ syncType, lines }) => {
              if (syncType !== 'LINE_SYNCED') {
                return of([]);
              }

              return of(lines).pipe(
                ...(pipes as [
                  MonoTypeOperatorFunction<LineResponseInterface[]>,
                ]),
              );
            }),
            map(
              (lyrics) =>
                new CurrentlyPlayingState({
                  ...current,
                  lyrics,
                  isLyricModified: true,
                }),
            ),
          );
      }
    };
  }

  private updateTrackState(
    acc: CurrentlyPlayingState,
    val: CurrentlyPlayingState,
  ) {
    const progress = val.progress + (new Date().getTime() - val.timestamp);

    if (val.isLyricModified === false) {
      return new CurrentlyPlayingState({
        ...val,
        lyrics: acc.lyrics,
        activeLyricIndex: acc.getCurrentLyricIndex(progress),
        progress,
      });
    }

    return new CurrentlyPlayingState({
      ...val,
      activeLyricIndex: val.getCurrentLyricIndex(progress),
      progress,
    });
  }

  private createSharedSubjectConfiguration(): ShareConfig<CurrentlyPlayingState> {
    return {
      connector: () => new BehaviorSubject(new CurrentlyPlayingState({})),
      resetOnError: false,
      resetOnComplete: false,
      resetOnRefCountZero: false,
    };
  }
}
