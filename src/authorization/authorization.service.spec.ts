import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service.js';

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorizationService],
    }).compile();

    authorizationService = module.get(AuthorizationService);
  });

  describe('validate', () => {
    jest.useFakeTimers();

    it('should be able to mark subject $event as a success if authorization dto contains the defined code', (done) => {
      const code = Math.random().toString(36).substring(2);

      authorizationService.event$.subscribe({
        next: (val) => {
          expect(val).toBe(code);
          done();
        },
      });

      authorizationService.validate({ code });
      jest.runAllTimers();
    });

    it('should be able to mark subject $event as an error if authorization dto does not contain code', (done) => {
      authorizationService.event$.subscribe({
        error: (val) => {
          expect(val).toBe('Authorization validation failed.');
          done();
        },
      });

      authorizationService.validate({});
      jest.runAllTimers();
    });
  });
});
