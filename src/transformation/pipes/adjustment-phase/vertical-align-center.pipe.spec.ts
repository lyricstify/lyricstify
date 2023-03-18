import { verticalAlignCenter } from './vertical-align-center.pipe.js';

describe('verticalAlignCenter', () => {
  it('should be able to add empty string arrays based on half of the given max height', () => {
    const lyrics = [
      ['Lorem ipsum dolor sit amet consectetur adipisicing elit'],
      [
        'Molestiae, in, quasi a enim ut molestias fuga aliquam atque dolore id sint?',
      ],
    ];
    const aligned = verticalAlignCenter({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 9,
        maxWidth: 0,
      },
    });

    expect(aligned.lyrics.slice(0, 4)).toEqual([[''], [''], [''], ['']]);
    expect(aligned.lyrics.slice(6)).toEqual([[''], [''], [''], ['']]);
  });
});
