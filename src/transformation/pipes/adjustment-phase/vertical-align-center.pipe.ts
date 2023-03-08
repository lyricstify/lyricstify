import { AdjustmentPipeFunction } from '../../interfaces/adjustment-pipe-function.interface.js';

export const verticalAlignCenter: AdjustmentPipeFunction = ({
  lyrics,
  options,
}) => {
  const halfHeight = Math.floor(options.maxHeight / 2);
  const verticalPadding: string[][] = Array(halfHeight).fill([['']]);
  const alignedLyrics = [...verticalPadding, ...lyrics, ...verticalPadding];

  return { lyrics: alignedLyrics, options };
};
