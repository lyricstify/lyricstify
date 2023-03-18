import { faker } from '@faker-js/faker';
import { LineResponseInterface } from '../../../src/lyric/interfaces/line-response.interface.js';

interface CreateRandomLinesOptions {
  count: number;
}

export const createRandomLinesResponse = ({
  count = faker.datatype.number({ min: 100, max: 500 }),
}: Partial<CreateRandomLinesOptions>): LineResponseInterface[] => {
  const lines = Array.from({ length: count }).reduce<LineResponseInterface[]>(
    (acc) => [
      ...acc,
      {
        words: faker.lorem.lines(1),
        endTimeMs: 0,
        startTimeMs:
          (acc.at(-1)?.startTimeMs || 0) +
          faker.datatype.number({ min: 500, max: 5000 }),
      },
    ],
    [],
  );

  return lines;
};
