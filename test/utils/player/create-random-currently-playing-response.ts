import { faker } from '@faker-js/faker';

type CurrentlyPlayingResponse = Pick<
  SpotifyApi.CurrentlyPlayingResponse,
  'timestamp' | 'is_playing' | 'currently_playing_type'
> & {
  progress_ms: number;
  item: {
    id: string;
  };
};

export const createRandomCurrentlyPlayingResponse = ({
  timestamp,
  progress_ms,
  is_playing,
  item,
  currently_playing_type,
}: Partial<CurrentlyPlayingResponse>): CurrentlyPlayingResponse => ({
  timestamp: timestamp || faker.date.future().getTime(),
  progress_ms:
    progress_ms || faker.datatype.number({ min: 100000, max: 999999 }),
  is_playing: is_playing || faker.datatype.boolean(),
  item: item || {
    id: faker.random.numeric(),
  },
  currently_playing_type:
    currently_playing_type ||
    faker.helpers.arrayElement(['track', 'episode', 'ad', 'unknown']),
});
