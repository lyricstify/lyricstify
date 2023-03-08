export type PipelineFunction<T> = (arg: T) => T;

export const pipeline = <T>(
  ...fns: PipelineFunction<T>[]
): PipelineFunction<T> => {
  return (arg: T) => fns.reduce((prev, fn) => fn(prev), arg);
};
