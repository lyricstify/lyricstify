import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

export const kuroshiroRomanization = (): InitializationPipeFunction => {
  const kuroshiro = new Kuroshiro();
  const initializeKuroshiro = kuroshiro.init(new KuromojiAnalyzer());

  return (lines) => {
    return from(
      (async () => {
        await initializeKuroshiro;

        const romanizedLines = lines.map(async (line) => {
          if (Kuroshiro.Util.hasJapanese(line.words) === false) {
            return line;
          }

          const roman = await kuroshiro.convert(line.words, {
            to: 'romaji',
            mode: 'spaced',
          });

          return { ...line, words: `${line.words}\n${roman}` };
        });

        return Promise.all(romanizedLines);
      })(),
    );
  };
};
