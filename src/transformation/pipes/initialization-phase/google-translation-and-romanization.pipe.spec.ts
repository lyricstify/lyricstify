import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
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
      const romanized = faker.lorem.sentences();
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('google-translate-api-x', () => ({
        translate: jest.fn().mockReturnValue(
          lyrics.map((line) => ({
            text: line.words,
            raw: [[romanized]],
          })),
        ),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: true,
          showTranslation: false,
          hideSourceLyrics: false,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
      expect(lines?.at(1)).toBe(romanized);
    });

    it('should be able to hide source lyrics if sentences can be romanized', async () => {
      const romanized = faker.lorem.sentences();
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('google-translate-api-x', () => ({
        translate: jest.fn().mockReturnValue(
          lyrics.map((line) => ({
            text: line.words,
            raw: [[romanized]],
          })),
        ),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: true,
          showTranslation: false,
          hideSourceLyrics: true,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines).toHaveLength(1);
      expect(lines?.at(0)).toBe(romanized);
    });

    it('should be able to skip adding non romanized sentences to new lines', async () => {
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('google-translate-api-x', () => ({
        translate: jest.fn().mockReturnValue(
          lyrics.map((line) => ({
            text: line.words,
          })),
        ),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: true,
          showTranslation: false,
          hideSourceLyrics: false,
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

      jest.unstable_mockModule('google-translate-api-x', () => ({
        translate: jest.fn().mockReturnValue(lyrics.map(() => ({ text }))),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: false,
          showTranslation: true,
          hideSourceLyrics: false,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
      expect(lines?.at(1)).toBe(text);
    });

    it('should be able to hide source lyrics if sentences can be translated', async () => {
      const text = faker.lorem.sentences();
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('google-translate-api-x', () => ({
        translate: jest.fn().mockReturnValue(lyrics.map(() => ({ text }))),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: false,
          showTranslation: true,
          hideSourceLyrics: true,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines).toHaveLength(1);
      expect(lines?.at(0)).toBe(text);
    });

    it('should be able to skip adding untranslated sentences to new lines', async () => {
      const lyrics = createRandomLinesResponse({ count: 1 });

      jest.unstable_mockModule('google-translate-api-x', () => ({
        translate: jest
          .fn()
          .mockReturnValue(lyrics.map((line) => ({ text: line.words }))),
      }));

      const result = await firstValueFrom(
        googleTranslationAndRomanization({
          to: 'en',
          romanize: false,
          showTranslation: true,
          hideSourceLyrics: false,
        })(lyrics),
      );
      const lines = result.at(0)?.words.split('\n');

      expect(lines).toHaveLength(1);
      expect(lines?.at(0)).toBe(lyrics.at(0)?.words);
    });
  });
});
