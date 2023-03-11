import { AxiosError } from 'axios';
import { catchError, MonoTypeOperatorFunction, pipe, throwError } from 'rxjs';

export const throwAxiosErrorResponseIfAvailable = <
  T,
>(): MonoTypeOperatorFunction<T> =>
  pipe(
    catchError(
      (
        error: AxiosError<{
          error: { message: string } | string;
          error_description: string;
        }>,
      ) =>
        throwError(
          () =>
            new Error(
              (typeof error.response?.data.error === 'object'
                ? JSON.stringify(error.response?.data.error.message)
                : error.response?.data.error) ||
                error.response?.data.error_description ||
                error.response?.statusText ||
                error.message,
            ),
        ),
    ),
  );
