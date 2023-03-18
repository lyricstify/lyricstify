import { faker } from '@faker-js/faker';
import Kuroshiro from 'kuroshiro';
import { firstValueFrom } from 'rxjs';
import { createRandomLinesResponse } from '../../../../test/utils/lyric/create-random-lines-response.js';
import { romanizeJapaneseSentences } from './romanize-japanese-sentences.pipe.js';

describe('romanizeJapaneseSentences', () => {
  it('should be able to romanize japanese characters and add them to new lines', async () => {
    faker.setLocale('ja');
    const lyrics = createRandomLinesResponse({ count: 1 });

    const result = await firstValueFrom(romanizeJapaneseSentences()(lyrics));
    const lines = result.at(0)?.words.split('\n');

    expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
    expect(lines?.at(1)).not.toBeUndefined();
    expect(Kuroshiro.Util.isJapanese(lines?.at(1) as string)).toBe(false);
  });

  it('should be able to skip adding non-japanese characters to new lines', async () => {
    faker.setLocale('en');
    const lyrics = createRandomLinesResponse({ count: 1 });

    const result = await firstValueFrom(romanizeJapaneseSentences()(lyrics));
    const lines = result.at(0)?.words.split('\n');

    expect(lines).toHaveLength(1);
    expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
  });
});
