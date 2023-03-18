import { horizontalAlignCenter } from './horizontal-align-center.pipe.js';

describe('horizontalAlignCenter', () => {
  it('should be able to add whitespace indentation to normal lyrics string', () => {
    const lyrics = [['Lorem ipsum dolor sit amet']];
    const aligned = horizontalAlignCenter({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 30,
      },
    });

    expect(aligned.lyrics.at(0)?.at(0)).toBe('  Lorem ipsum dolor sit amet');
  });

  it('should be able to add whitespace indentation to unicode lyrics string', () => {
    const lyrics = [['君の中にある 赤と青き線']];
    const aligned = horizontalAlignCenter({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 30,
      },
    });

    expect(aligned.lyrics.at(0)?.at(0)).toBe('   君の中にある 赤と青き線');
  });

  it(`should be able to return original lyrics if the indentation length is less than 0`, () => {
    const lyrics = [['君の中にある 赤と青き線']];
    const aligned = horizontalAlignCenter({
      lyrics,
      options: {
        activeLyricIndex: null,
        maxHeight: 0,
        maxWidth: 20,
      },
    });

    expect(aligned.lyrics.at(0)?.at(0)).toBe('君の中にある 赤と青き線');
  });
});
