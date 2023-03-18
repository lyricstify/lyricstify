import { faker } from '@faker-js/faker';
import { InitializeOptionsDto } from '../../../src/initialize/dto/initialize-options.dto.js';

export const createRandomInitializeOptionsDto = ({
  id,
  redirectUri,
  redirectUriPort,
  secret,
}: Partial<InitializeOptionsDto>) => {
  const randomPort = String(
    faker.datatype.number({
      min: 1000,
      max: 9999,
    }),
  );

  return new InitializeOptionsDto({
    id: id || faker.random.alphaNumeric(32, { casing: 'mixed' }),
    redirectUri:
      redirectUri || `http://localhost:${randomPort}/api/v1/authorize`,
    redirectUriPort: redirectUriPort || randomPort,
    secret: secret || faker.random.alphaNumeric(32, { casing: 'mixed' }),
  });
};
