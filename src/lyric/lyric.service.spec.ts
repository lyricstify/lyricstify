import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { LyricService } from './lyric.service.js';
import { LyricDto } from './dto/lyric.dto.js';
import { AxiosError } from 'axios';
import { createFakeAxiosResponse } from '../../test/utils/axios.js';
import { LyricResponseInterface } from './interfaces/lyric-response.interface.js';

describe('LyricService', () => {
  let lyricService: LyricService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LyricService],
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
    it('should be able to return lyric dto', async () => {
      const track = {
        lyrics: {
          syncType: 'LINE_SYNCED',
          lines: [],
        } as Pick<LyricResponseInterface, 'syncType' | 'lines'>,
      } as const;

      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(createFakeAxiosResponse({ data: track })));

      expect(await lyricService.findOne('')).toEqual(
        new LyricDto({
          lines: track.lyrics.lines,
          syncType: track.lyrics.syncType,
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

      await expect(lyricService.findOne('')).rejects.toThrowError('error');
    });
  });
});
