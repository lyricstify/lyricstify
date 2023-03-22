import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { TestingModule } from '@nestjs/testing';
import { rm } from 'fs/promises';
import { CommandTestFactory } from 'nest-commander-testing';
import { resolve } from 'path';
import { defer, map, of, Subscription, tap } from 'rxjs';
import { CliModule } from '../src/cli.module.js';
import { DataSourceService } from '../src/common/data-source/data-source.service.js';
import { PipeOptionsDto } from '../src/pipe/dto/pipe-options.dto.js';
import { PipeOrchestraObservable } from '../src/pipe/observables/pipe-orchestra.observable.js';
import { PipeService } from '../src/pipe/pipe.service.js';
import { RefreshTokenService } from '../src/refresh-token/refresh-token.service.js';
import { TransformationService } from '../src/transformation/transformation.service.js';
import { createRandomClientEntity } from './utils/client/create-random-client-entity.js';
import { createFakeAxiosResponse } from './utils/common/create-fake-axios-response.js';
import { waitFor } from './utils/common/wait-for.js';
import { createRandomLyricsResponse } from './utils/lyric/create-random-lyrics-response.js';
import { createRandomTrackResponse } from './utils/lyric/create-random-track-response.js';
import { createRandomCurrentlyPlayingResponse } from './utils/player/create-random-currently-playing-response.js';
import { fakeCurrentlyPlaying } from './utils/player/fake-currently-playing.js';
import { createRandomRefreshTokenResponse } from './utils/refresh-token/create-random-refresh-token-response.js';
import { createRandomTokenResponse } from './utils/token/create-random-token-response.js';

describe('PipeCommand (e2e)', () => {
  let commandInstance: TestingModule;
  let httpService: HttpService;

  const subscription = new Subscription();
  const configDir = resolve('.tests/pipe.e2e-spec');

  const refreshTokenResponse = createRandomRefreshTokenResponse({});
  const tokenResponse = createRandomTokenResponse({});
  const trackResponse = createRandomTrackResponse({
    lyrics: createRandomLyricsResponse({
      syncType: 'LINE_SYNCED',
      lines: [
        {
          words: faker.lorem.lines(1),
          endTimeMs: 0,
          startTimeMs: 1500,
        },
        {
          words: faker.lorem.lines(1),
          endTimeMs: 0,
          startTimeMs: 3000,
        },
        {
          words: faker.lorem.lines(1),
          endTimeMs: 0,
          startTimeMs: 4500,
        },
        {
          words: faker.lorem.lines(1),
          endTimeMs: 0,
          startTimeMs: 6000,
        },
      ],
    }),
  });
  const clientEntity = createRandomClientEntity({});
  const currentlyPlayingResponse = createRandomCurrentlyPlayingResponse({
    currently_playing_type: 'track',
    is_playing: true,
  });

  beforeEach(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [CliModule],
    })
      .overrideProvider(DataSourceService)
      .useValue(new DataSourceService(configDir))
      .overrideProvider(PipeService)
      .useFactory({
        inject: [PipeOrchestraObservable, TransformationService],
        factory: (
          pipeOrchestraObservable: PipeOrchestraObservable,
          transformationService: TransformationService,
        ) =>
          new (class extends PipeService {
            orchestra(options: PipeOptionsDto) {
              const { orchestraSubscriber } = super.orchestra(options);
              subscription.add(orchestraSubscriber);

              return { orchestraSubscriber };
            }
          })(pipeOrchestraObservable, transformationService),
      })
      .overrideProvider(HttpService)
      .useValue({
        get: jest.fn(),
        post: jest.fn().mockImplementation((url, data) => {
          if (
            url === 'https://accounts.spotify.com/api/token' &&
            data instanceof URLSearchParams
          ) {
            if (data.get('grant_type') === 'authorization_code') {
              return of(
                createFakeAxiosResponse({ data: refreshTokenResponse }),
              );
            }

            if (data.get('grant_type') === 'refresh_token') {
              return of(createFakeAxiosResponse({ data: tokenResponse }));
            }
          }

          return of();
        }),
      })
      .compile();

    await commandInstance.get(RefreshTokenService).replaceFrom(clientEntity);

    httpService = commandInstance.get(HttpService);
  });

  afterEach(async () => {
    subscription.unsubscribe();

    await rm(configDir, { recursive: true });
  });

  describe('pipe', () => {
    it('should be able to continuously show different lyrics to stdout if the currently playing progress is always changing', async () => {
      const lyrics = trackResponse.lyrics.lines;
      const now = new Date();
      const currentlyPlaying = fakeCurrentlyPlaying({
        collection: [
          {
            ...currentlyPlayingResponse,
            progress_ms: lyrics.at(0)?.startTimeMs || 0,
            timestamp: new Date().setHours(now.getHours() + 1),
          },
          {
            ...currentlyPlayingResponse,
            progress_ms: lyrics.at(1)?.startTimeMs || 0,
            timestamp: new Date().setHours(now.getHours() + 2),
          },
          {
            ...currentlyPlayingResponse,
            progress_ms: lyrics.at(2)?.startTimeMs || 0,
            timestamp: new Date().setHours(now.getHours() + 3),
          },
          {
            ...currentlyPlayingResponse,
            progress_ms: lyrics.at(3)?.startTimeMs || 0,
            timestamp: new Date().setHours(now.getHours() + 4),
          },
        ] as SpotifyApi.CurrentlyPlayingResponse[],
      });

      const waitForCurrentlyPlaying = waitFor({ attempts: 4 });
      const consoleSpy = jest.spyOn(console, 'info').mockReturnValue();

      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        if (
          url.includes('https://api.lyricstify.vercel.app/v1/lyrics') === true
        ) {
          return of(createFakeAxiosResponse({ data: trackResponse }));
        }

        if (url === 'https://api.spotify.com/v1/me/player/currently-playing') {
          return defer(currentlyPlaying).pipe(
            map((data) => createFakeAxiosResponse({ data })),
            tap(waitForCurrentlyPlaying.increment),
          );
        }

        return of();
      });

      await CommandTestFactory.run(commandInstance, ['pipe']);
      await waitForCurrentlyPlaying.finished;

      expect(consoleSpy).nthCalledWith(1, '');
      expect(consoleSpy).nthCalledWith(2, lyrics.at(0)?.words);
      expect(consoleSpy).nthCalledWith(3, lyrics.at(1)?.words);
      expect(consoleSpy).nthCalledWith(4, lyrics.at(2)?.words);
      expect(consoleSpy).nthCalledWith(5, lyrics.at(3)?.words);
    }, 10000);
  });
});
