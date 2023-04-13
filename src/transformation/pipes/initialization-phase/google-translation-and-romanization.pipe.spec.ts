import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { SrcTranslit as SourceTranslation } from '@vitalets/google-translate-api/dist/cjs/types.js';
import { firstValueFrom } from 'rxjs';
import { createRandomLinesResponse } from '../../../../test/utils/lyric/create-random-lines-response.js';
import { googleTranslationAndRomanization } from './google-translation-and-romanization.pipe.js';

describe('googleTranslationAndRomanization', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('romanization', () => {
    it('should be able to romanize sentences and add them to new lines', async () => {
      const sentences = [
        {
          src_translit: faker.lorem.sentences(),
        },
      ] as SourceTranslation[];
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('@vitalets/google-translate-api', () => ({
        translate: jest.fn().mockReturnValue({ text: '', raw: { sentences } }),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: true,
          showTranslation: false,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
      expect(lines?.at(1)).toBe(sentences.at(0)?.src_translit);
    });

    it('should be able to skip adding non romanized sentences to new lines', async () => {
      const lyrics = createRandomLinesResponse({ count: 1 });
      const sentences = [
        {
          src_translit: lyrics.at(0)?.words,
        },
      ] as SourceTranslation[];

      jest.unstable_mockModule('@vitalets/google-translate-api', () => ({
        translate: jest.fn().mockReturnValue({ raw: { sentences } }),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: true,
          showTranslation: false,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines).toHaveLength(1);
      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
    });
  });

  describe('translation', () => {
    it('should be able to translate sentences and add them to new lines', async () => {
      const text = faker.lorem.sentences();
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('@vitalets/google-translate-api', () => ({
        translate: jest.fn().mockReturnValue({
          raw: {
            sentences: [
              {
                trans: text,
                orig: lyrics.at(0)?.words,
              },
            ],
          },
        }),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: false,
          showTranslation: true,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
      expect(lines?.at(1)).toBe(text);
    });

    it('should be able to skip adding untranslated sentences to new lines', async () => {
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('@vitalets/google-translate-api', () => ({
        translate: jest.fn().mockReturnValue({
          text: lyrics.at(0)?.words,
          raw: { sentences: [] },
        }),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: false,
          showTranslation: true,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines).toHaveLength(1);
      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
    });
  });
});
