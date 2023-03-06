export class RefreshTokenEntity {
  value: string;
  type: string;
  scope: string;

  constructor({ value, type, scope }: RefreshTokenEntity) {
    this.value = value;
    this.type = type;
    this.scope = scope;
  }
}
