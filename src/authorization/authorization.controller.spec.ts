import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from './authorization.controller.js';
import { AuthorizationService } from './authorization.service.js';

describe('AuthorizationController', () => {
  let authorizationController: AuthorizationController;
  let authorizationService: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
    })
      .useMocker((token) => {
        if (token === AuthorizationService) {
          return { validate: jest.fn() };
        }

        return {};
      })
      .compile();

    authorizationController = module.get(AuthorizationController);
    authorizationService = module.get(AuthorizationService);
  });

  describe('index', () => {
    it('should be able to return value from the validation authorization service', () => {
      jest.spyOn(authorizationService, 'validate').mockReturnValue('Success');

      expect(authorizationController.index({})).toBe('Success');
    });
  });
});
