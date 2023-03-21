import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse, isAxiosError } from 'axios';
import { catchError, firstValueFrom, map, of, retry } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { ConfigService } from '../config/config.service.js';
import { LyricDto } from './dto/lyric.dto.js';
import { LyricResponseInterface } from './interfaces/lyric-response.interface.js';
import { TrackResponseInterface } from './interfaces/track-response.interface.js';

@Injectable()
export class LyricService {
  private readonly lyricApiOriginPath =
    'https://api.lyricstify.vercel.app/v1/lyrics';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(trackId: string) {
    const request$ = this.httpService
      .get<TrackResponseInterface>(`${this.lyricApiOriginPath}/${trackId}`, {
        timeout: this.configService.timeout,
      })
      .pipe(
        catchError((error) => {
          if (
            isAxiosError(error) &&
            (error.response?.status === HttpStatus.NOT_FOUND ||
              error.response?.status === HttpStatus.FORBIDDEN)
          ) {
            return of({
              config: error.response?.config,
              headers: error.response?.headers,
              status: error.response?.status,
              statusText: error.response?.statusText,
              request: error.request,
              data: {
                lyrics: {
                  lines: [],
                  syncType: 'UNSYNCED',
                } as Partial<LyricResponseInterface>,
              },
            } as AxiosResponse);
          }

          throw error;
        }),
        retry({
          delay: this.configService.retryDelay,
          count: this.configService.retryCount,
        }),
        map(this.convertToLyricDto),
        throwAxiosErrorResponseIfAvailable(this.constructor.name),
      );

    return await firstValueFrom(request$);
  }

  private convertToLyricDto({
    data: { lyrics },
  }: AxiosResponse<TrackResponseInterface>) {
    return new LyricDto({
      lines: lyrics.lines,
      syncType: lyrics.syncType,
    });
  }
}
