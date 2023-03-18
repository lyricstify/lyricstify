import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { of, take } from 'rxjs';
import terminalKit from 'terminal-kit';
import { createRandomLinesResponse } from '../../../test/utils/lyric/create-random-lines-response.js';
import { GraduallyUpdateProgressObservable } from '../../player/observables/gradually-update-progress.observable.js';
import { PollCurrentlyPlayingObservable } from '../../player/observables/poll-currently-playing.observable.js';
import { CurrentlyPlayingState } from '../../player/states/currently-playing.state.js';
import { ResizeEventObservable } from '../../terminal-kit/observables/resize-event.observable.js';
import { TerminalSizeState } from '../../terminal-kit/states/terminal-size.state.js';
import { StartOrchestraObservable } from './start-orchestra.observable.js';

describe('StartOrchestraObservable', () => {
  let startOrchestraObservable: StartOrchestraObservable;
  let graduallyUpdateProgressObservable: GraduallyUpdateProgressObservable;

  const currentlyPlayingState = new CurrentlyPlayingState({
    isActive: true,
    isPlaying: true,
    isLyricModified: true,
  });
  const terminalSizeState = new TerminalSizeState({
    height: 30,
    width: 60,
    isResized: true,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartOrchestraObservable],
    })
      .useMocker((token) => {
        if (token === PollCurrentlyPlayingObservable) {
          return { run: jest.fn() };
        }

        if (token === GraduallyUpdateProgressObservable) {
          return { run: jest.fn() };
        }

        if (token === ResizeEventObservable) {
          return { run: jest.fn().mockReturnValue(of(terminalSizeState)) };
        }

        return {};
      })
      .compile();

    startOrchestraObservable = module.get(StartOrchestraObservable);
    graduallyUpdateProgressObservable = module.get(
      GraduallyUpdateProgressObservable,
    );
  });

  describe('run', () => {
    it('should be able to emit the updated terminal content state to observers', async () => {
      const cursor = 0;
      const lyrics = createRandomLinesResponse({ count: 5 });

      jest.spyOn(graduallyUpdateProgressObservable, 'run').mockReturnValue(
        of(
          new CurrentlyPlayingState({
            ...currentlyPlayingState,
            lyrics,
            activeLyricIndex: cursor,
          }),
        ),
      );

      const startOrchestra$ = startOrchestraObservable
        .run({
          adjustmentPipes: [],
          initializationPipes: [],
          updateProgressPipes: [],
          delay: 0,
          terminal: terminalKit.terminal,
        })
        .pipe(take(1));

      const observerSpy = subscribeSpyTo(startOrchestra$);
      await observerSpy.onComplete();
      const terminalContentState = observerSpy.getFirstValue();

      expect(terminalContentState.content).toEqual(
        lyrics.map(({ words }) => words).join('\n'),
      );
      expect(terminalContentState.cursor).toBe(cursor);
    });
  });
});
