import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { defer, firstValueFrom, map, retry, switchMap } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { ConfigService } from '../config/config.service.js';
import { TokenService } from '../token/token.service.js';
import { CurrentlyPlayingDto } from './dto/currently-playing.dto.js';

@Injectable()
export class PlayerService {
  private readonly playerApiOriginPath =
    'https://api.spotify.com/v1/me/player/';

  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async currentlyPlaying() {
    const request$ = defer(async () => {
      const token =
        await this.tokenService.findOneOrCreateFromExistingRefreshToken();
      const config: AxiosRequestConfig = {
        timeout: this.configService.timeout,
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
          Host: 'api.spotify.com',
        },
      };

      return this.httpService.get<SpotifyApi.CurrentlyPlayingResponse>(
        `${this.playerApiOriginPath}currently-playing`,
        config,
      );
    }).pipe(
      retry({
        delay: this.configService.retryDelay,
        count: this.configService.retryCount,
      }),
      switchMap((val) => val),
      map(this.convertToCurrentlyPlayingDto),
      throwAxiosErrorResponseIfAvailable(this.constructor.name),
    );

    return await firstValueFrom(request$);
  }

  private convertToCurrentlyPlayingDto(
    response: AxiosResponse<SpotifyApi.CurrentlyPlayingResponse>,
  ) {
    return new CurrentlyPlayingDto({
      isActive: response.status === HttpStatus.OK,
      isPlaying: response.data?.is_playing || false,
      progress: response.data?.progress_ms || 0,
      type: response.data?.currently_playing_type || null,
      trackId: response.data?.item?.id || null,
      timestamp: new Date().getTime(),
    });
  }
}
