import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { Observable, of } from 'rxjs';
import { createFakeAxiosResponse } from '../../test/utils/common/create-fake-axios-response.js';
import { createRandomCurrentlyPlayingResponse } from '../../test/utils/player/create-random-currently-playing-response.js';
import { ConfigService } from '../config/config.service.js';
import { TokenService } from '../token/token.service.js';
import { CurrentlyPlayingDto } from './dto/currently-playing.dto.js';
import { PlayerService } from './player.service.js';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: ConfigService,
          useValue: {
            retryDelay: 0,
            retryCount: 0,
            timeout: 0,
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === HttpService) {
          return { get: jest.fn() };
        }

        if (token === TokenService) {
          return {
            findOneOrCreateFromExistingRefreshToken: jest.fn().mockReturnValue({
              value: faker.random.alphaNumeric(132, { casing: 'mixed' }),
            }),
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
      const currentlyPlayingResponse = createRandomCurrentlyPlayingResponse({});
      const time = new Date();

      jest.useFakeTimers().setSystemTime(time);
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(
          of(createFakeAxiosResponse({ data: currentlyPlayingResponse })),
        );

      expect(await playerService.currentlyPlaying()).toEqual(
        new CurrentlyPlayingDto({
          isActive: true,
          isPlaying: currentlyPlayingResponse.is_playing,
          progress: currentlyPlayingResponse.progress_ms,
          timestamp: time.getTime(),
          trackId: currentlyPlayingResponse.item.id,
          type: currentlyPlayingResponse.currently_playing_type,
        }),
      );
    });

    it('should be able to return default currently playing dto if response is empty', async () => {
      const time = new Date();

      jest.useFakeTimers().setSystemTime(time);
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(
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
