export const waitFor = ({ attempts }: { attempts: number }) => {
  let count = 0;
  let resolver: () => void;

  const promise = new Promise<void>((resolve) => {
    resolver = resolve;
  });

  return {
    increment: () => {
      count += 1;

      if (count >= attempts) {
        resolver();
      }
    },
    finished: promise,
  };
};
