import { faker } from '@faker-js/faker';
import { RefreshTokenEntity } from '../../../src/refresh-token/entities/refresh-token.entity.js';

export const createRandomRefreshTokenEntity = ({
  buffer,
  scope,
  type,
  value,
}: Partial<RefreshTokenEntity>) =>
  new RefreshTokenEntity({
    buffer: buffer || faker.random.alphaNumeric(80, { casing: 'mixed' }),
    scope: scope || 'user-read-currently-playing',
    type: type || 'Bearer',
    value: value || faker.random.alphaNumeric(132, { casing: 'mixed' }),
  });
