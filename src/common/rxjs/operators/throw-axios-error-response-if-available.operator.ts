import { isAxiosError } from 'axios';
import chalk from 'chalk';
import { catchError, MonoTypeOperatorFunction, pipe } from 'rxjs';

export const throwAxiosErrorResponseIfAvailable = <T>(
  from: string,
): MonoTypeOperatorFunction<T> =>
  pipe(
    catchError((error: Error) => {
      if (isAxiosError(error)) {
        const message = `${error.name}: ${
          error.message
        }\n\nResponse: ${JSON.stringify(
          error.response?.data,
        )}\n\nSource: ${from}\n\nPlease rerun the related command again or try to run ${chalk.inverse(
          'lyricstify init',
        )}. If this does not solve your problem feel free to open a new issue to https://github.com/lyricstify/lyricstify/issues/`;

        throw new Error(message);
      }

      throw error;
    }),
  );
