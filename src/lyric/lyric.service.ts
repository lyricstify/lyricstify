import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { LyricDto } from './dto/lyric.dto.js';
import { TrackResponseInterface } from './interfaces/track-response.inteface.js';

@Injectable()
export class LyricService {
  private readonly lyricApiOriginPath =
    'https://api.lyricstify.vercel.app/v1/lyrics/';

  constructor(private readonly httpService: HttpService) {}

  async findOne(trackId: string) {
    const request$ = this.httpService
      .get<TrackResponseInterface>(`${this.lyricApiOriginPath}/${trackId}`)
      .pipe(map(this.convertToLyricDto), throwAxiosErrorResponseIfAvailable());

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
