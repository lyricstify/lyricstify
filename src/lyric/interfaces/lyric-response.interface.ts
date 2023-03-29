import { LineResponseInterface } from './line-response.interface.js';

export interface LyricResponseInterface {
  syncType: 'UNSYNCED' | 'LINE_SYNCED';
  lines: LineResponseInterface[];
  language: string;
}
