export const fakeCurrentlyPlaying = <T>({
  collection,
}: {
  collection: T[];
}) => {
  let index = 0;

  return () => {
    const currentProgress = collection.at(index);

    if (currentProgress === undefined) {
      throw new Error(`Currently Playing DTO with index ${index} is undefined`);
    }

    index += 1;

    return Promise.resolve(currentProgress);
  };
};
