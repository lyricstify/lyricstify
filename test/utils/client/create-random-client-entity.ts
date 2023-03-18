import { faker } from '@faker-js/faker';
import { ClientEntity } from '../../../src/client/entities/client.entity.js';

export const createRandomClientEntity = ({
  code,
  id,
  secret,
  redirectUri,
}: Partial<ClientEntity>) =>
  new ClientEntity({
    code: code || faker.random.alphaNumeric(260, { casing: 'mixed' }),
    id: id || faker.random.alphaNumeric(32, { casing: 'mixed' }),
    secret: secret || faker.random.alphaNumeric(32, { casing: 'mixed' }),
    redirectUri:
      redirectUri ||
      `http://localhost:${faker.datatype.number({
        min: 1000,
        max: 9999,
      })}/api/v1/authorize`,
  });
