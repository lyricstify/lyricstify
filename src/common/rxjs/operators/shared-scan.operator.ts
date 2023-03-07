import { map, Observable, pipe, tap, UnaryFunction } from 'rxjs';

export const sharedScan = <T, R>(
  accumulator: (acc: R, value: T) => R,
  seed: R,
): UnaryFunction<Observable<T>, Observable<R>> => {
  let state: R = seed;

  return pipe(
    tap((value) => (state = accumulator(state, value))),
    map(() => state),
  );
};
