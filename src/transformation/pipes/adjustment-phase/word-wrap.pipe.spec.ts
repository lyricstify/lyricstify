import { wordWrap } from './word-wrap.pipe.js';

describe('wordWrap', () => {
  it('should be able to split lyrics into new lines if words exceed the given max width', () => {
    const lyrics = [
      ['Lorem ipsum dolor sit amet consectetur adipisicing elit.'],
    ];
    const wordWrapped = wordWrap({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 15,
      },
    });

    expect(wordWrapped.lyrics.at(0)).toEqual([
      'Lorem ipsum ',
      'dolor sit amet ',
      'consectetur ',
      'adipisicing ',
      'elit. ',
    ]);
  });

  it(`should be able to split lyrics into new lines if the lyrics' is unicode strings and not contains whitespace`, () => {
    const lyrics = [['随分と長い夢を']];
    const wordWrapped = wordWrap({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 10,
      },
    });

    expect(wordWrapped.lyrics.at(0)).toEqual(['随分と長い', '夢を']);
  });
});
