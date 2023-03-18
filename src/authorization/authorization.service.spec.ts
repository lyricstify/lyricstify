import { faker } from '@faker-js/faker';
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
    it('should be able to emit value to the next method in subscriber if authorization dto contains the defined code', (done) => {
      const code = faker.random.alphaNumeric(260, { casing: 'mixed' });
      jest.useFakeTimers();

      authorizationService.validate({ code });
      authorizationService.event$.subscribe({
        next: (val) => {
          expect(val).toBe(code);
          done();
        },
      });

      jest.runAllTimers();
    });

    it('should be able to emit an error message to the error method in subscriber if authorization dto does not contain code', (done) => {
      jest.useFakeTimers();

      authorizationService.validate({});
      authorizationService.event$.subscribe({
        error: (val) => {
          expect(val).toBe('Authorization validation failed.');
          done();
        },
      });

      jest.runAllTimers();
    });
  });
});
