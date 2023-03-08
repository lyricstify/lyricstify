import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

export const romanizeJapaneseSentences: InitializationPipeFunction = (
  lines,
) => {
  return from(
    (async () => {
      const kuroshiro = new Kuroshiro();
      await kuroshiro.init(new KuromojiAnalyzer());

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
