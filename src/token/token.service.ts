import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map, retry } from 'rxjs';
import { throwAxiosErrorResponseIfAvailable } from '../common/rxjs/operators/throw-axios-error-response-if-available.operator.js';
import { RefreshTokenService } from '../refresh-token/refresh-token.service.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { RefreshTokenEntity } from '../refresh-token/entities/refresh-token.entity.js';
import { CreateTokenDto } from './dto/create-token.dto.js';
import { TokenEntity } from './entities/token.entity.js';
import { RequestTokenResponseInterface } from './interfaces/request-token-response.interface.js';
import { ConfigService } from '../config/config.service.js';

@Injectable()
export class TokenService {
  private readonly requestFreshTokenOriginPath =
    'https://accounts.spotify.com/api/token';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly tokenRepository: DataSourceRepository<TokenEntity>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async replaceFrom(refreshToken: RefreshTokenEntity) {
    const data = new URLSearchParams({
      refresh_token: refreshToken.value,
      grant_type: 'refresh_token',
    });

    const config: AxiosRequestConfig = {
      timeout: this.configService.timeout,
      headers: {
        Authorization: `Basic ${refreshToken.buffer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const request$ = this.httpService
      .post<RequestTokenResponseInterface>(
        this.requestFreshTokenOriginPath,
        data,
        config,
      )
      .pipe(
        retry({
          delay: this.configService.retryDelay,
          count: this.configService.retryCount,
        }),
        map(this.convertToCreateTokenDto),
        throwAxiosErrorResponseIfAvailable(this.constructor.name),
      );

    const createTokenDto = await firstValueFrom(request$);
    return await this.tokenRepository.replace(createTokenDto);
  }

  async findOne() {
    return await this.tokenRepository.find();
  }

  async findOneOrFail() {
    const token = await this.findOne();

    if (token === null) {
      throw new Error('Token not found!');
    }

    return token;
  }

  async findOneOrCreateFromExistingRefreshToken() {
    const token = await this.findOne();

    if (token !== null) {
      const isExpired =
        token.expiresInSeconds * 1000 + token.createdAt <= new Date().getTime();

      if (isExpired === false) {
        return token;
      }
    }

    const refreshToken =
      await this.refreshTokenService.findOneOrCreateFromExistingClient();
    return await this.replaceFrom(refreshToken);
  }

  private convertToCreateTokenDto({
    data,
  }: AxiosResponse<RequestTokenResponseInterface>) {
    return new CreateTokenDto({
      scope: data.scope,
      type: data.token_type,
      value: data.access_token,
      createdAt: new Date().getTime(),
      expiresInSeconds: data.expires_in,
    });
  }
}
