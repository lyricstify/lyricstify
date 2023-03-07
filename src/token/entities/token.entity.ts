export class TokenEntity {
  value: string;
  type: string;
  scope: string;
  expiresInSeconds: number;
  createdAt: number;

  constructor({
    value,
    type,
    scope,
    expiresInSeconds,
    createdAt,
  }: TokenEntity) {
    this.value = value;
    this.type = type;
    this.scope = scope;
    this.expiresInSeconds = expiresInSeconds;
    this.createdAt = createdAt;
  }
}
