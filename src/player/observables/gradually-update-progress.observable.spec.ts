import { jest } from '@jest/globals';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Test, TestingModule } from '@nestjs/testing';
import { of, take } from 'rxjs';
import { createRandomLinesResponse } from '../../../test/utils/lyric/create-random-lines-response.js';
import { CurrentlyPlayingState } from '../states/currently-playing.state.js';
import { GraduallyUpdateProgressObservable } from './gradually-update-progress.observable.js';
import { ConfigService } from '../../config/config.service.js';

describe('GraduallyUpdateProgressObservable', () => {
  let graduallyUpdateProgressObservable: GraduallyUpdateProgressObservable;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraduallyUpdateProgressObservable,
        {
          provide: ConfigService,
          useValue: {
            retryDelay: 0,
            retryCount: 0,
            timeout: 0,
          },
        },
      ],
    }).compile();

    graduallyUpdateProgressObservable = module.get(
      GraduallyUpdateProgressObservable,
    );
  });

  describe('run', () => {
    it('should be able gradually emits updated currently playing state containing the next lyrics if the track is playing', async () => {
      const time = new Date().getTime();
      const currentlyPlayingState = new CurrentlyPlayingState({
        lyrics: createRandomLinesResponse({ count: 2 }),
        isActive: true,
        isPlaying: true,
        progress: 0,
        timestamp: time,
      });

      jest.useFakeTimers();
      jest.setSystemTime(time + 1);

      const pollCurrentlyPlaying$ = of(currentlyPlayingState);
      const graduallyUpdateProgress$ = graduallyUpdateProgressObservable
        .run({
          pollCurrentlyPlaying$,
        })
        .pipe(take(3));
      const observerSpy = subscribeSpyTo(graduallyUpdateProgress$);

      jest.advanceTimersToNextTimer(2);
      await observerSpy.onComplete();

      expect(observerSpy.getValueAt(0).activeLyricIndex).toBe(-1);
      expect(observerSpy.getValueAt(1).activeLyricIndex).toBe(0);
      expect(observerSpy.getValueAt(2).activeLyricIndex).toBe(1);
    });
  });
});
