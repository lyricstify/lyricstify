import { splitStringByWidth } from './split-string-by-width.util.js';

describe('splitStringByWidth', () => {
  it('should be able to split normal strings', () => {
    const text = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.';

    expect(splitStringByWidth(text, { width: 20 })).toEqual([
      'Lorem ipsum dolor si',
      't, amet consectetur ',
      'adipisicing elit.',
    ]);
  });

  it('should be able to split unicode strings by their actual width', () => {
    const text = '時には誰かを知らず知らずのうちに';

    expect(splitStringByWidth(text, { width: 9 })).toEqual([
      '時には誰',
      'かを知ら',
      'ず知らず',
      'のうちに',
    ]);
  });
});
