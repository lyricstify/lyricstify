import { horizontalAlignRight } from './horizontal-align-right.pipe.js';

describe('horizontalAlignRight', () => {
  it('should be able to add whitespace indentation to normal lyrics string', () => {
    const lyrics = [['Lorem ipsum dolor sit amet']];
    const aligned = horizontalAlignRight({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 30,
      },
    });

    expect(aligned.lyrics.at(0)?.at(0)).toBe('    Lorem ipsum dolor sit amet');
  });

  it('should be able to add whitespace indentation to unicode lyrics string', () => {
    const lyrics = [['少し寂しそうな君に']];
    const aligned = horizontalAlignRight({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 30,
      },
    });

    expect(aligned.lyrics.at(0)?.at(0)).toBe('            少し寂しそうな君に');
  });

  it(`should be able to return original lyrics if string's actual width is longer than the given max width`, () => {
    const lyrics = [['少し寂しそうな君に']];
    const aligned = horizontalAlignRight({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 5,
      },
    });

    expect(aligned.lyrics.at(0)?.at(0)).toBe('少し寂しそうな君に');
  });
});
