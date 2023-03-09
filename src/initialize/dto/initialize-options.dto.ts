import { OmitType } from '@nestjs/mapped-types';
import { ClientEntity } from '../../client/entities/client.entity.js';

export class InitializeOptionsDto extends OmitType(ClientEntity, ['code']) {
  redirectUriPort: string;

  constructor({
    id,
    redirectUri,
    redirectUriPort,
    secret,
  }: InitializeOptionsDto) {
    super();

    this.id = id;
    this.redirectUri = redirectUri;
    this.redirectUriPort = redirectUriPort;
    this.secret = secret;
  }
}
