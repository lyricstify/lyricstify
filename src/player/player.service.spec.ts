import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { Observable, of } from 'rxjs';
import { createFakeAxiosResponse } from '../../test/utils/axios.js';
import { TokenService } from '../token/token.service.js';
import { CurrentlyPlayingDto } from './dto/currently-playing.dto.js';
import { PlayerService } from './player.service.js';

type Res = SpotifyApi.CurrentlyPlayingResponse;

describe('PlayerService', () => {
  let playerService: PlayerService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerService],
    })
      .useMocker((token) => {
        if (token === HttpService) {
          return { get: jest.fn() };
        }

        if (token === TokenService) {
          return {
            findOneOrCreateFromExistingRefreshToken: jest
              .fn()
              .mockReturnValue({ value: 'fake token value' }),
          };
        }

        return {};
      })
      .compile();

    playerService = module.get(PlayerService);
    httpService = module.get(HttpService);
  });

  describe('currentlyPlaying', () => {
    it('should be able to return currently playing dto if response available', async () => {
      const track = {
        is_playing: true as Res['is_playing'],
        progress_ms: 100 as NonNullable<Res['progress_ms']>,
        currently_playing_type: 'track' as Res['currently_playing_type'],
        item: { id: '1' } as NonNullable<Res['item']>,
      } as const;

      const time = new Date();

      jest.useFakeTimers().setSystemTime(time);

      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(createFakeAxiosResponse({ data: track })));

      expect(await playerService.currentlyPlaying()).toEqual(
        new CurrentlyPlayingDto({
          isActive: true,
          isPlaying: track.is_playing,
          progress: track.progress_ms,
          timestamp: time.getTime(),
          trackId: track.item.id,
          type: track.currently_playing_type,
        }),
      );
    });

    it('should be able to return default currently playing dto if response is empty', async () => {
      const time = new Date();

      jest.useFakeTimers().setSystemTime(time);

      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() =>
          of(createFakeAxiosResponse({ statusCode: HttpStatus.NO_CONTENT })),
        );

      expect(await playerService.currentlyPlaying()).toEqual(
        new CurrentlyPlayingDto({
          isActive: false,
          isPlaying: false,
          progress: 0,
          timestamp: time.getTime(),
          trackId: null,
          type: null,
        }),
      );
    });

    it('should be able to throw an unwrapped error message', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(
        () =>
          new Observable((subscriber) => {
            subscriber.error(new AxiosError('error'));
          }),
      );

      await expect(playerService.currentlyPlaying()).rejects.toThrowError(
        'error',
      );
    });
  });
});
