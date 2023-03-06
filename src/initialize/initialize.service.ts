import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { RefreshTokenService } from '../refresh-token/refresh-token.service.js';
import { ClientService } from '../client/client.service.js';
import { CreateClientDto } from '../client/dto/create-client-dto.js';
import { bootstrap } from '../http.js';
import { InitializeClientDto } from './dto/initialize-client.dto.js';
import { RequestAuthorizationDto } from './dto/request-authorization.dto.js';

@Injectable()
export class InitializeService {
  private readonly authorizationOriginPath =
    'https://accounts.spotify.com/authorize';

  constructor(
    private readonly clientService: ClientService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async authorize(initializeOptionsDto: InitializeClientDto) {
    try {
      const code = await bootstrap(
        Number(initializeOptionsDto.redirectUriPort),
      );

      const createClientDto = new CreateClientDto({
        id: initializeOptionsDto.id,
        secret: initializeOptionsDto.secret,
        redirectUri: initializeOptionsDto.redirectUri,
        code,
      });

      await this.clientService.replace(createClientDto);
      await this.refreshTokenService.replaceFrom(createClientDto);

      return `${chalk.green(
        '✔',
      )} Successfully initialized Lyricstify configuration, you can now run ${chalk.inverse(
        'lyricstify start',
      )} and start singing!`;
    } catch (e) {
      const message = (() => {
        if (typeof e === 'string') {
          return e;
        }

        if (e instanceof Error) {
          return e.message;
        }

        return 'An error occurred, please try again.';
      })();

      return chalk.red(`✘ ${message}`);
    }
  }

  createAuthorizationLink(requestAuthorizationDto: RequestAuthorizationDto) {
    const queryParams = new URLSearchParams({
      response_type: requestAuthorizationDto.responseType,
      client_id: requestAuthorizationDto.clientId,
      scope: requestAuthorizationDto.scope,
      redirect_uri: requestAuthorizationDto.redirectUri,
    }).toString();

    return `${this.authorizationOriginPath}?${queryParams}`;
  }
}
