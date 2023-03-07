export class RefreshTokenEntity {
  value: string;
  type: string;
  scope: string;
  buffer: string;

  constructor({ value, type, scope, buffer }: RefreshTokenEntity) {
    this.value = value;
    this.type = type;
    this.scope = scope;
    this.buffer = buffer;
  }
}
