import { faker } from '@faker-js/faker';
import { highlightVerticallyCenteredLyrics } from './highlight-vertically-centered-lyrics.pipe.js';

describe('highlightVerticallyCenteredLyrics', () => {
  const lyrics = [
    [''],
    [''],
    [''],
    [faker.lorem.sentences(), faker.lorem.sentences()],
    [faker.lorem.sentences()],
    [faker.lorem.sentences(), faker.lorem.sentences(), faker.lorem.sentences()],
    [''],
    [''],
    [''],
  ];

  it('should be able to set the active lyrics index to -2 from the top of lyrics when the height is 6, so active lyrics will be in the middle', () => {
    const result = highlightVerticallyCenteredLyrics('')({
      lyrics,
      options: {
        activeLyricIndex: 1,
        maxHeight: 6,
        maxWidth: 0,
      },
    });

    expect(result.options.activeLyricIndex).toBe(-2);
  });

  it('should be able to add a markup to the currently active lyrics index', () => {
    const result = highlightVerticallyCenteredLyrics('^+')({
      lyrics: lyrics,
      options: {
        activeLyricIndex: 2,
        maxHeight: 6,
        maxWidth: 0,
      },
    });

    expect(result.lyrics.at(5)).toEqual([
      `^+${lyrics.at(5)?.at(0)}`,
      `^+${lyrics.at(5)?.at(1)}`,
      `^+${lyrics.at(5)?.at(2)}`,
    ]);
  });
});
