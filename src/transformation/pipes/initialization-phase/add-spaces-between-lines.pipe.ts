import { of } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';

export const addSpaceBetweenLines = (
  count: number,
): InitializationPipeFunction => {
  return (lines) => {
    return of(
      lines.map((line) => ({
        ...line,
        words: `${line.words}${'\n'.repeat(count)}`,
      })),
    );
  };
};
