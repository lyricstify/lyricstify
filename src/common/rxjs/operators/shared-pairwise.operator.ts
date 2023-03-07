import { map, Observable, pipe, tap, UnaryFunction } from 'rxjs';

export const sharedPairwise = <T>(
  initial?: T,
): UnaryFunction<Observable<T>, Observable<[T | undefined, T]>> => {
  let previous = initial;

  return pipe(
    map((value: T): [T | undefined, T] => [previous, value]),
    tap(([, current]) => (previous = current)),
  );
};
