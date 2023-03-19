import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  readonly retryDelay = 1000;

  readonly retryCount = Infinity;

  readonly timeout = 10000;
}
