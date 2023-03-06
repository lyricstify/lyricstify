export class ClientEntity {
  id: string;
  secret: string;
  code: string;
  redirectUri: string;

  constructor({ id, secret, code, redirectUri }: ClientEntity) {
    this.id = id;
    this.secret = secret;
    this.code = code;
    this.redirectUri = redirectUri;
  }
}
