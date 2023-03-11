import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from './authorization.controller.js';
import { AuthorizationService } from './authorization.service.js';

describe('AuthorizationController', () => {
  let authorizationController: AuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
    })
      .useMocker((token) => {
        if (token === AuthorizationService) {
          return { validate: jest.fn().mockReturnValue('Success') };
        }

        return {};
      })
      .compile();

    authorizationController = module.get(AuthorizationController);
  });

  describe('index', () => {
    it('should be able to return value from the validation authorization service', () => {
      expect(authorizationController.index({})).toBe('Success');
    });
  });
});
