import { Injectable } from '@nestjs/common';
import { homedir } from 'os';
import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

@Injectable()
export class DataSourceService {
  private readonly configDir = join(homedir(), '.config', 'lyricstify');

  access<T = any>(relativeFilePath: string): Low<T | undefined> {
    const file = join(this.configDir, relativeFilePath);
    const adapter = new JSONFile<T>(file);
    const db = new Low(adapter);

    return db;
  }
}
