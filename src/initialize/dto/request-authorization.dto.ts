import { ClientEntity } from '../../client/entities/client.entity.js';

export class RequestAuthorizationDto {
  responseType = 'code';
  scope = 'user-read-currently-playing';
  redirectUri = 'http://localhost:{port}/api/v1/authorize';
  clientId: ClientEntity['id'];
  redirectUriPort: number;

  constructor({
    clientId,
    redirectUriPort,
  }: Pick<RequestAuthorizationDto, 'clientId' | 'redirectUriPort'>) {
    this.clientId = clientId;
    this.redirectUriPort = redirectUriPort;
    this.redirectUri = this.redirectUri.replace(
      '{port}',
      String(redirectUriPort),
    );
  }
}
