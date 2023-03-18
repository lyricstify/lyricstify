import { faker } from '@faker-js/faker';
import { LyricResponseInterface } from '../../../src/lyric/interfaces/lyric-response.interface.js';
import { createRandomLinesResponse } from './create-random-lines-response.js';

export const createRandomLyricsResponse = ({
  syncType,
  lines,
  provider,
  providerLyricsId,
  providerDisplayName,
  language,
}: Partial<LyricResponseInterface>): LyricResponseInterface => {
  const randomProviderName = faker.company.name();

  return {
    syncType:
      syncType || faker.helpers.arrayElement(['UNSYNCED', 'LINE_SYNCED']),
    lines:
      lines ||
      createRandomLinesResponse({
        count: faker.datatype.number({ min: 100, max: 500 }),
      }),
    provider: provider || randomProviderName,
    providerLyricsId: providerLyricsId || faker.random.numeric(9),
    providerDisplayName:
      providerDisplayName || randomProviderName.toLowerCase(),
    language: language || faker.random.locale(),
  };
};
