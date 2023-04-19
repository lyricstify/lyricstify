import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

export const kuroshiroRomanization = ({
  hideSourceLyrics,
}: {
  hideSourceLyrics: boolean;
}): InitializationPipeFunction => {
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

          const words =
            hideSourceLyrics === true ? roman : `${line.words}\n${roman}`;

          return { ...line, words };
        });

        return Promise.all(romanizedLines);
      })(),
    );
  };
};
