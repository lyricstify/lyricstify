import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { firstValueFrom } from 'rxjs';
import { createRandomLinesResponse } from '../../../../test/utils/lyric/create-random-lines-response.js';
import { translateSentences } from './translate-sentences.pipe.js';

describe('translateSentences', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('should be able to translate sentences and add them to new lines', async () => {
    const text = faker.lorem.sentences();
    const lyrics = createRandomLinesResponse({ count: 1 });

    jest.unstable_mockModule('@vitalets/google-translate-api', () => ({
      translate: jest.fn().mockReturnValue({ text }),
    }));

    const result = await firstValueFrom(translateSentences('en')(lyrics));
    const lines = result.at(0)?.words.split('\n');

    expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
    expect(lines?.at(1)).toBe(text);
  });

  it('should be able to skip adding untranslated sentences to new lines', async () => {
    const lyrics = createRandomLinesResponse({ count: 1 });

    jest.unstable_mockModule('@vitalets/google-translate-api', () => ({
      translate: jest.fn().mockReturnValue({ text: lyrics.at(0)?.words }),
    }));

    const result = await firstValueFrom(translateSentences('en')(lyrics));
    const lines = result.at(0)?.words.split('\n');

    expect(lines).toHaveLength(1);
    expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
  });
});
