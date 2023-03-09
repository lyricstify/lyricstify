import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { TokenService } from '../token/token.service.js';
import { CurrentlyPlayingDto } from './dto/currently-playing.dto.js';

@Injectable()
export class PlayerService {
  private readonly playerApiOriginPath =
    'https://api.spotify.com/v1/me/player/';

  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
  ) {}

  async currentlyPlaying() {
    const token =
      await this.tokenService.findOneOrCreateFromExistingRefreshToken();
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
        Host: 'api.spotify.com',
      },
    };

    const request$ = this.httpService
      .get<SpotifyApi.CurrentlyPlayingResponse>(
        `${this.playerApiOriginPath}currently-playing`,
        config,
      )
      .pipe(
        map(this.convertToCurrentlyPlayingDto),
        throwAxiosErrorResponseIfAvailable(),
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
