import { faker } from '@faker-js/faker';
import { RequestTokenResponseInterface } from '../../../src/token/interfaces/request-token-response.interface.js';

export const createRandomTokenResponse = ({
  access_token,
  expires_in,
  scope,
  token_type,
}: Partial<RequestTokenResponseInterface>): RequestTokenResponseInterface => ({
  access_token:
    access_token || faker.random.alphaNumeric(132, { casing: 'mixed' }),
  expires_in: expires_in || faker.datatype.number({ min: 3600, max: 86400 }),
  scope: scope || 'user-read-currently-playing',
  token_type: token_type || 'Bearer',
});
