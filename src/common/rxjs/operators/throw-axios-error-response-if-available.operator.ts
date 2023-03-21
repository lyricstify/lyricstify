import { isAxiosError } from 'axios';
import chalk from 'chalk';
import { catchError, MonoTypeOperatorFunction, pipe, throwError } from 'rxjs';
import terminalLink from 'terminal-link';

export const throwAxiosErrorResponseIfAvailable = <T>(
  from: string,
): MonoTypeOperatorFunction<T> =>
  pipe(
    catchError((error) => {
      return throwError(() => {
        if (isAxiosError(error)) {
          const message = `${error.name}: ${
            error.message
          }\n\nResponse: ${JSON.stringify(
            error.response?.data,
          )}\n\nSource: ${from}\n\nPlease rerun the related command again or try to run ${chalk.inverse(
            'lyricstify init',
          )}. If this does not solve your problem feel free to open a new issue to ${terminalLink(
            'this link',
            'https://github.com/lyricstify/lyricstify/issues/',
          )}.`;

          return new Error(message);
        }

        return new Error(error);
      });
    }),
  );
