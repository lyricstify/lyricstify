import { AxiosError } from 'axios';
import { catchError, MonoTypeOperatorFunction, pipe, throwError } from 'rxjs';

export const throwAxiosErrorResponseIfAvailable = <
  T,
>(): MonoTypeOperatorFunction<T> =>
  pipe(
    catchError(
      (error: AxiosError<{ error: string; error_description: string }>) =>
        throwError(
          () =>
            new Error(
              `Failed to get refresh token data. Message: ${
                error.response?.data.error_description ||
                error.response?.data.error ||
                error.response?.statusText ||
                error.message
              }`,
            ),
        ),
    ),
  );
