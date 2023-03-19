import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { createRandomLinesResponse } from '../../../test/utils/lyric/create-random-lines-response.js';
import { GraduallyUpdateProgressObservable } from '../../player/observables/gradually-update-progress.observable.js';
import { PollCurrentlyPlayingObservable } from '../../player/observables/poll-currently-playing.observable.js';
import { CurrentlyPlayingState } from '../../player/states/currently-playing.state.js';
import { PipeOrchestraObservable } from './pipe-orchestra.observable.js';

describe('PipeOrchestraObservable', () => {
  let pipeOrchestraObservable: PipeOrchestraObservable;
  let graduallyUpdateProgressObservable: GraduallyUpdateProgressObservable;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PipeOrchestraObservable],
    })
      .useMocker((token) => {
        if (token === PollCurrentlyPlayingObservable) {
          return {
            run: jest.fn(),
          };
        }

        if (token === GraduallyUpdateProgressObservable) {
          return {
            run: jest.fn(),
          };
        }

        return {};
      })
      .compile();

    pipeOrchestraObservable = module.get(PipeOrchestraObservable);
    graduallyUpdateProgressObservable = module.get(
      GraduallyUpdateProgressObservable,
    );
  });

  describe('run', () => {
    it('should be able to emits content state with currently active lyrics', async () => {
      const currentlyPlayingState = new CurrentlyPlayingState({
        lyrics: createRandomLinesResponse({ count: 5 }),
        isActive: true,
        isPlaying: true,
        activeLyricIndex: 0,
      });

      jest
        .spyOn(graduallyUpdateProgressObservable, 'run')
        .mockReturnValue(of(currentlyPlayingState));

      const pipeOrchestra$ = pipeOrchestraObservable.run({
        delay: 0,
        initializationPipes: [],
        syncType: 'none',
      });
      const observerSpy = subscribeSpyTo(pipeOrchestra$);
      await observerSpy.onComplete();

      expect(observerSpy.getFirstValue().content).toBe(
        currentlyPlayingState.lyrics.at(0)?.words,
      );
    });

    it('should be able to emits content state with an empty string if active lyric index is not found', async () => {
      const currentlyPlayingState = new CurrentlyPlayingState({
        lyrics: createRandomLinesResponse({ count: 5 }),
        isActive: true,
        isPlaying: true,
        activeLyricIndex: null,
      });

      jest
        .spyOn(graduallyUpdateProgressObservable, 'run')
        .mockReturnValue(of(currentlyPlayingState));

      const pipeOrchestra$ = pipeOrchestraObservable.run({
        delay: 0,
        initializationPipes: [],
        syncType: 'none',
      });
      const observerSpy = subscribeSpyTo(pipeOrchestra$);
      await observerSpy.onComplete();

      expect(observerSpy.getFirstValue().content).toBe('');
    });
  });
});
