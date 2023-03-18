import { faker } from '@faker-js/faker';
import { TokenEntity } from '../../../src/token/entities/token.entity.js';

export const createRandomTokenEntity = ({
  createdAt,
  expiresInSeconds,
  scope,
  type,
  value,
}: Partial<TokenEntity>) =>
  new TokenEntity({
    createdAt: createdAt || new Date().getTime(),
    expiresInSeconds:
      expiresInSeconds || faker.datatype.number({ min: 3600, max: 86400 }),
    scope: scope || 'user-read-currently-playing',
    type: type || 'Bearer',
    value: value || faker.random.alphaNumeric(132, { casing: 'mixed' }),
  });
