import { faker } from '@faker-js/faker';
import { LineResponseInterface } from '../../lyric/interfaces/line-response.interface.js';
import { CurrentlyPlayingState } from './currently-playing.state.js';

describe('CurrentlyPlayingState', () => {
  const lyrics: LineResponseInterface[] = [
    { startTimeMs: 100, words: faker.lorem.sentences() },
    { startTimeMs: 200, words: faker.lorem.sentences() },
    { startTimeMs: 300, words: faker.lorem.sentences() },
  ];

  describe('currentLyricIndexByProgressTime', () => {
    it('should return -1 if the progress time is less than the start time of the first lyric', () => {
      const state = new CurrentlyPlayingState({ lyrics });
      expect(state.currentLyricIndexByProgressTime(0)).toBe(-1);
    });

    it('should return the index of the lyric that matches the progress time', () => {
      const state = new CurrentlyPlayingState({ lyrics });
      expect(state.currentLyricIndexByProgressTime(100)).toBe(0);
      expect(state.currentLyricIndexByProgressTime(200)).toBe(1);
      expect(state.currentLyricIndexByProgressTime(300)).toBe(2);
    });

    it('should return the index of the last lyric if the progress time is greater than the end time of the last lyric', () => {
      const state = new CurrentlyPlayingState({ lyrics });
      expect(state.currentLyricIndexByProgressTime(400)).toBe(2);
    });

    it('should be able to give null if the lyrics is empty', () => {
      const state = new CurrentlyPlayingState({});

      expect(state.currentLyricIndexByProgressTime(0)).toBe(null);
      expect(state.currentLyricIndexByProgressTime(100)).toBe(null);
    });
  });

  describe('nextLyric', () => {
    it('should be able to give null if current active lyric index is null', () => {
      const state = new CurrentlyPlayingState({
        lyrics,
        activeLyricIndex: null,
      });

      expect(state.nextLyric()).toBe(null);
    });

    it('should be able to lock lyric if current active lyric index is latest', () => {
      const state = new CurrentlyPlayingState({
        lyrics,
        activeLyricIndex: 2,
      });

      expect(state.nextLyric()).toEqual({
        index: 2,
        value: lyrics.at(2),
      });
    });

    it('should be able to get next lyric if available', () => {
      const state = new CurrentlyPlayingState({
        lyrics,
        activeLyricIndex: 1,
      });

      expect(state.nextLyric()).toEqual({
        index: 2,
        value: lyrics.at(2),
      });
    });
  });
});
