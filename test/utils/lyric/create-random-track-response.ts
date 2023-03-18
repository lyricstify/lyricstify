import { TrackResponseInterface } from '../../../src/lyric/interfaces/track-response.interface.js';
import { createRandomLyricsResponse } from './create-random-lyrics-response.js';

export const createRandomTrackResponse = ({
  lyrics,
}: Partial<TrackResponseInterface>): TrackResponseInterface => ({
  lyrics: lyrics || createRandomLyricsResponse({}),
});
