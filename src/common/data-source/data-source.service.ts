import { Injectable } from '@nestjs/common';
import { homedir } from 'os';
import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { existsSync, mkdirSync } from 'fs';
import { DataSourceRepository } from './data-source.repository.js';

@Injectable()
export class DataSourceService {
  constructor(
    private readonly configDir = join(homedir(), '.config', 'lyricstify'),
  ) {}

  access<T = unknown>(relativeFilePath: string) {
    if (existsSync(this.configDir) === false) {
      mkdirSync(this.configDir, { recursive: true });
    }

    const file = join(this.configDir, relativeFilePath);
    const adapter = new JSONFile<T>(file);
    const db = new Low(adapter);

    return new DataSourceRepository(db);
  }
}
