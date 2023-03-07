import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { ClientEntity } from '../client/entities/client.entity.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto.js';
import { RefreshTokenEntity } from './entities/refresh-token.entity.js';
import { RequestAccessTokenResponseInterface } from './interfaces/request-access-token-response.interface.js';

@Injectable()
export class RefreshTokenService {
  private readonly requestAccessTokenOriginPath =
    'https://accounts.spotify.com/api/token';

  constructor(
    private readonly refreshTokenService: DataSourceRepository<RefreshTokenEntity>,
    private readonly httpService: HttpService,
  ) {}

  async replaceFrom(client: ClientEntity) {
    const data = new URLSearchParams({
      code: client.code,
      redirect_uri: client.redirectUri,
      grant_type: 'authorization_code',
    });
    const buffer = Buffer.from(`${client.id}:${client.secret}`).toString(
      'base64',
    );
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${buffer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const request$ = this.httpService
      .post<RequestAccessTokenResponseInterface>(
        this.requestAccessTokenOriginPath,
        data,
        config,
      )
      .pipe(
        map(this.convertToCreateRefreshTokenDto(buffer)),
        throwAxiosErrorResponseIfAvailable(),
      );

    const createRefreshTokenDto = await firstValueFrom(request$);
    return await this.refreshTokenService.replace(createRefreshTokenDto);
  }

  async findOne() {
    return await this.refreshTokenService.find();
  }

  async findOneOrFail() {
    const refreshToken = await this.findOne();

    if (refreshToken === null) {
      throw new Error('Refresh token not found!');
    }

    return refreshToken;
  }

  private convertToCreateRefreshTokenDto(buffer: string) {
    return ({ data }: AxiosResponse<RequestAccessTokenResponseInterface>) =>
      new CreateRefreshTokenDto({
        scope: data.scope,
        type: data.token_type,
        value: data.refresh_token,
        buffer,
      });
  }
}
