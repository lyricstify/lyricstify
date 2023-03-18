import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { LyricService } from './lyric.service.js';
import { LyricDto } from './dto/lyric.dto.js';
import { AxiosError } from 'axios';
import { createFakeAxiosResponse } from '../../test/utils/common/create-fake-axios-response.js';
import { createRandomTrackResponse } from '../../test/utils/lyric/create-random-track-response.js';
import { createRandomLyricsResponse } from '../../test/utils/lyric/create-random-lyrics-response.js';
import { faker } from '@faker-js/faker';
import { ConfigService } from '../config/config.service.js';

describe('LyricService', () => {
  let lyricService: LyricService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LyricService,
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
          return {
            get: jest.fn(),
          };
        }

        return {};
      })
      .compile();

    lyricService = module.get(LyricService);
    httpService = module.get(HttpService);
  });

  describe('findOne', () => {
    it('should be able to return lyric dto if the response success', async () => {
      const trackResponse = createRandomTrackResponse({
        lyrics: createRandomLyricsResponse({
          syncType: 'LINE_SYNCED',
          lines: [],
        }),
      });

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(createFakeAxiosResponse({ data: trackResponse })));

      expect(await lyricService.findOne('')).toEqual(
        new LyricDto({
          lines: trackResponse.lyrics.lines,
          syncType: trackResponse.lyrics.syncType,
        }),
      );
    });

    it('should be able to throw an unwrapped error message if an error occurs', async () => {
      const errorMessage = faker.lorem.sentences();

      jest.spyOn(httpService, 'get').mockReturnValue(
        new Observable((subscriber) => {
          subscriber.error(new AxiosError(errorMessage));
        }),
      );

      await expect(lyricService.findOne('')).rejects.toThrowError(errorMessage);
    });
  });
});
