import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { ClientEntity } from '../client/entities/client.entity.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto.js';
import { RefreshTokenEntity } from './entities/refresh-token.entity.js';
import { RequestAccessTokenInvalidResponseInterface } from './interfaces/request-access-token-invalid-response.interface.js';
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
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${client.id}:${client.secret}`,
        ).toString('base64')}`,
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
        map(
          ({ data }) =>
            new CreateRefreshTokenDto({
              scope: data.scope,
              type: data.token_type,
              value: data.refresh_token,
            }),
        ),
        catchError(
          (error: AxiosError<RequestAccessTokenInvalidResponseInterface>) =>
            throwError(
              () =>
                new Error(
                  error.response?.data.error_description || error.message,
                ),
            ),
        ),
      );

    const createRefreshTokenDto = await firstValueFrom(request$);
    return await this.refreshTokenService.replace(createRefreshTokenDto);
  }

  async findOne() {
    return await this.refreshTokenService.find();
  }
}
