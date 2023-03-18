import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  retryDelay = 1000;

  retryCount = Infinity;

  timeout = 10000;
}
