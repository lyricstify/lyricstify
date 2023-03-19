import { faker } from '@faker-js/faker';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { skip, take } from 'rxjs';
import { createRandomLinesResponse } from '../../../test/utils/lyric/create-random-lines-response.js';
import { fakeCurrentlyPlaying } from '../../../test/utils/player/fake-currently-playing.js';
import { LyricDto } from '../../lyric/dto/lyric.dto.js';
import { LyricService } from '../../lyric/lyric.service.js';
import { CurrentlyPlayingDto } from '../dto/currently-playing.dto.js';
import { PlayerService } from '../player.service.js';
import { CurrentlyPlayingState } from '../states/currently-playing.state.js';
import { PollCurrentlyPlayingObservable } from './poll-currently-playing.observable.js';

const expectArrayOf = ({
  type,
  length,
}: {
  type: { new (...args: any[]): any };
  length: number;
}) => expect.arrayContaining(Array.from({ length }).fill(expect.any(type)));

describe('PollCurrentlyPlayingObservable', () => {
  let pollCurrentlyPlayingObservable: PollCurrentlyPlayingObservable;
  let playerService: PlayerService;
  let lyricService: LyricService;

  const currentlyPlayingDto = new CurrentlyPlayingDto({
    isActive: true,
    isPlaying: true,
    progress: 0,
    timestamp: new Date().getTime(),
    trackId: faker.random.alphaNumeric(22, { casing: 'mixed' }),
    type: 'track',
  });

  const lyricDto = new LyricDto({
    lines: createRandomLinesResponse({ count: 3 }),
    syncType: 'LINE_SYNCED',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollCurrentlyPlayingObservable],
    })
      .useMocker((token) => {
        if (token === PlayerService) {
          return {
            currentlyPlaying: jest
              .fn()
              .mockReturnValue(Promise.resolve(currentlyPlayingDto)),
          };
        }

        if (token === LyricService) {
          return {
            findOne: jest.fn().mockReturnValue(Promise.resolve(lyricDto)),
          };
        }

        return {};
      })
      .compile();

    pollCurrentlyPlayingObservable = module.get(PollCurrentlyPlayingObservable);
    playerService = module.get(PlayerService);
    lyricService = module.get(LyricService);
  });

  describe('run', () => {
    it('should be able to emit 3 currently playing states when 3 http calls to currently playing always give different responses', async () => {
      jest.spyOn(playerService, 'currentlyPlaying').mockImplementation(
        fakeCurrentlyPlaying({
          collection: [
            { ...currentlyPlayingDto, progress: 0 },
            { ...currentlyPlayingDto, progress: 100 },
            { ...currentlyPlayingDto, progress: 200 },
          ],
        }),
      );

      const pollCurrentlyPlaying$ = pollCurrentlyPlayingObservable
        .run({ delay: 0, initializationPipes: [], syncType: 'none' })
        .pipe(take(4), skip(1)); // take the first 4 values, and skip the default value
      const observerSpy = subscribeSpyTo(pollCurrentlyPlaying$);
      await observerSpy.onComplete();

      expect(playerService.currentlyPlaying).toHaveBeenCalledTimes(3);
      expect(observerSpy.getValues()).toEqual(
        expectArrayOf({ type: CurrentlyPlayingState, length: 3 }),
      );
    });

    it('should be able to emit 3 currently playing states when only 3 of 6 http calls to currently playing have different responses ​​than before', async () => {
      jest.spyOn(playerService, 'currentlyPlaying').mockImplementation(
        fakeCurrentlyPlaying({
          collection: [
            { ...currentlyPlayingDto, progress: 0 },
            { ...currentlyPlayingDto, progress: 0 },
            { ...currentlyPlayingDto, progress: 100 },
            { ...currentlyPlayingDto, progress: 100 },
            { ...currentlyPlayingDto, progress: 100 },
            { ...currentlyPlayingDto, progress: 300 },
          ],
        }),
      );

      const pollCurrentlyPlaying$ = pollCurrentlyPlayingObservable
        .run({ delay: 0, initializationPipes: [], syncType: 'none' })
        .pipe(take(4), skip(1)); // take the first 4 values, and skip the default value
      const observerSpy = subscribeSpyTo(pollCurrentlyPlaying$);
      await observerSpy.onComplete();

      expect(playerService.currentlyPlaying).toHaveBeenCalledTimes(6);
      expect(observerSpy.getValues()).toEqual(
        expectArrayOf({ type: CurrentlyPlayingState, length: 3 }),
      );
    });

    it('should find lyrics only when the track is changed, then emits state that contains new lyrics', async () => {
      jest.spyOn(playerService, 'currentlyPlaying').mockImplementation(
        fakeCurrentlyPlaying({
          collection: [
            { ...currentlyPlayingDto, progress: 0 },
            { ...currentlyPlayingDto, progress: 100 },
          ],
        }),
      );

      const pollCurrentlyPlaying$ = pollCurrentlyPlayingObservable
        .run({ delay: 0, initializationPipes: [], syncType: 'none' })
        .pipe(take(3));

      const observerSpy = subscribeSpyTo(pollCurrentlyPlaying$);
      await observerSpy.onComplete();

      expect(lyricService.findOne).toHaveBeenCalledTimes(1);
      expect(observerSpy.getValueAt(0).lyrics).toEqual([]);
      expect(observerSpy.getValueAt(0).isLyricModified).toBe(false);
      expect(observerSpy.getValueAt(1).lyrics).toEqual(lyricDto.lines);
      expect(observerSpy.getValueAt(1).isLyricModified).toBe(true);
      expect(observerSpy.getValueAt(2).lyrics).toEqual(lyricDto.lines);
      expect(observerSpy.getValueAt(2).isLyricModified).toBe(false);
    });

    it('should be able to give empty lyrics if the currently playing is empty', async () => {
      jest
        .spyOn(playerService, 'currentlyPlaying')
        .mockReturnValue(
          Promise.resolve({ ...currentlyPlayingDto, isActive: false }),
        );

      const pollCurrentlyPlaying$ = pollCurrentlyPlayingObservable
        .run({ delay: 0, initializationPipes: [], syncType: 'none' })
        .pipe(take(2));
      const observerSpy = subscribeSpyTo(pollCurrentlyPlaying$);
      await observerSpy.onComplete();

      expect(observerSpy.getLastValue()?.lyrics).toEqual([]);
    });

    it('should be able to give empty lyrics array if lyrics type is not synced', async () => {
      jest
        .spyOn(lyricService, 'findOne')
        .mockReturnValue(
          Promise.resolve({ ...lyricDto, syncType: 'UNSYNCED' }),
        );

      const pollCurrentlyPlaying$ = pollCurrentlyPlayingObservable
        .run({ delay: 0, initializationPipes: [], syncType: 'none' })
        .pipe(take(2));
      const observerSpy = subscribeSpyTo(pollCurrentlyPlaying$);
      await observerSpy.onComplete();

      expect(observerSpy.getLastValue()?.lyrics).toEqual([]);
    });
  });
});
