import { faker } from '@faker-js/faker';
import { RequestAccessTokenResponseInterface } from '../../../src/refresh-token/interfaces/request-access-token-response.interface.js';

export const createRandomRefreshTokenResponse = ({
  access_token,
  expires_in,
  refresh_token,
  scope,
  token_type,
}: Partial<RequestAccessTokenResponseInterface>): RequestAccessTokenResponseInterface => ({
  access_token:
    access_token || faker.random.alphaNumeric(132, { casing: 'mixed' }),
  expires_in: expires_in || faker.datatype.number({ min: 3600, max: 86400 }),
  refresh_token:
    refresh_token || faker.random.alphaNumeric(132, { casing: 'mixed' }),
  scope: scope || 'user-read-currently-playing',
  token_type: token_type || 'Bearer',
});
