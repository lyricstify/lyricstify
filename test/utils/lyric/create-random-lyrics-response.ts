import { faker } from '@faker-js/faker';
import { LyricResponseInterface } from '../../../src/lyric/interfaces/lyric-response.interface.js';
import { createRandomLinesResponse } from './create-random-lines-response.js';

export const createRandomLyricsResponse = ({
  syncType,
  lines,
  language,
}: Partial<LyricResponseInterface>): LyricResponseInterface => {
  return {
    syncType:
      syncType || faker.helpers.arrayElement(['UNSYNCED', 'LINE_SYNCED']),
    lines:
      lines ||
      createRandomLinesResponse({
        count: faker.datatype.number({ min: 100, max: 500 }),
      }),
    language: language || faker.random.locale(),
  };
};
