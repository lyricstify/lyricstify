import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map, retry } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { ConfigService } from '../config/config.service.js';
import { LyricDto } from './dto/lyric.dto.js';
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
