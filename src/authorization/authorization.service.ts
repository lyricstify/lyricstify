import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { AuthorizationResponseDto } from './dto/authorization-response.dto.js';

@Injectable()
export class AuthorizationService {
  public readonly event$ = new Subject<string>();

  private complete(code: string) {
    setTimeout(() => {
      this.event$.next(code);
    }, 1000);
  }

  private error() {
    setTimeout(() => {
      this.event$.error('Authorization validation failed.');
    }, 1000);
  }

  validate(authorizationResponseDto: AuthorizationResponseDto): string {
    if (authorizationResponseDto.code !== undefined) {
      this.complete(authorizationResponseDto.code);

      return 'Successfully initialized Lyricstify configuration! You can close this page now.';
    }

    this.error();

    return (
      authorizationResponseDto.error ||
      'Code validation failed, please try again.'
    );
  }
}
