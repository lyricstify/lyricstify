import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map, retry } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { ClientEntity } from '../client/entities/client.entity.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto.js';
import { RefreshTokenEntity } from './entities/refresh-token.entity.js';
import { RequestAccessTokenResponseInterface } from './interfaces/request-access-token-response.interface.js';
import { ConfigService } from '../config/config.service.js';

@Injectable()
export class RefreshTokenService {
  private readonly requestAccessTokenOriginPath =
    'https://accounts.spotify.com/api/token';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: DataSourceRepository<RefreshTokenEntity>,
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
      timeout: this.configService.timeout,
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
        retry({
          delay: this.configService.retryDelay,
          count: this.configService.retryCount,
        }),
        map(this.convertToCreateRefreshTokenDto(buffer)),
        throwAxiosErrorResponseIfAvailable(this.constructor.name),
      );

    const createRefreshTokenDto = await firstValueFrom(request$);
    return await this.refreshTokenRepository.replace(createRefreshTokenDto);
  }

  async findOne() {
    return await this.refreshTokenRepository.find();
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
