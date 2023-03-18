import { firstValueFrom } from 'rxjs';
import { createRandomLinesResponse } from '../../../../test/utils/lyric/create-random-lines-response.js';
import { addSpaceBetweenLines } from './add-spaces-between-lines.pipe.js';

describe('addSpaceBetweenLines', () => {
  it('should be able to add 1 new space between lines', async () => {
    const lines = createRandomLinesResponse({ count: 3 });
    const add1SpaceBetweenLines = addSpaceBetweenLines(1);

    const result = await firstValueFrom(add1SpaceBetweenLines(lines));

    expect(result.map(({ words }) => words).join('\n')).toContain(
      `${lines.at(0)?.words}\n\n${lines.at(1)?.words}\n\n${lines.at(2)?.words}`,
    );
  });
});
