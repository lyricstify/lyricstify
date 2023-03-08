import { UpdateProgressPipeFunction } from '../../interfaces/update-progress-pipe-function.interface.js';

export const highlightActiveLyricsCenteredVertically = (
  markup = '^B',
): UpdateProgressPipeFunction => {
  return ({ lyrics, options }) => {
    const halfHeight = Math.floor(options.maxHeight / 2);

    const activeLyricIndex =
      options.activeLyricIndex !== null
        ? options.activeLyricIndex + halfHeight
        : 0;

    const verticalActiveCursor =
      lyrics
        .slice(halfHeight, activeLyricIndex)
        .reduce((acc, lyric) => lyric.length + acc, 0) * -1;

    const highlightedLyrics = (() => {
      if (options.activeLyricIndex === null) {
        return lyrics;
      }

      const lines = lyrics.at(activeLyricIndex);

      const highlightedCurrentLine =
        lines !== undefined ? lines.map((line) => `${markup}${line}`) : [];
      const previousLines = lyrics.slice(0, activeLyricIndex);
      const nextLines = lyrics.slice(activeLyricIndex + 1);

      return [...previousLines, highlightedCurrentLine, ...nextLines];
    })();

    return {
      lyrics: highlightedLyrics,
      options: { ...options, activeLyricIndex: verticalActiveCursor },
    };
  };
};
