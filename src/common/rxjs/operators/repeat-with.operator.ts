import { MonoTypeOperatorFunction, pipe, repeat, tap, timer } from 'rxjs';

export interface RepeatConfig {
  delay: number;
}

export const repeatWith = <T>(
  project: (value: T) => RepeatConfig,
): MonoTypeOperatorFunction<T> => {
  let delay: RepeatConfig['delay'];

  return pipe(
    tap((value) => (delay = project(value).delay)),
    repeat({ delay: () => timer(delay) }),
  );
};
