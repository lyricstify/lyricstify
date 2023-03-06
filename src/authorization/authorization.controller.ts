import { Controller, Get, Query } from '@nestjs/common';
import { AuthorizationService } from './authorization.service.js';
import { AuthorizationResponseDto } from './dto/authorization-response.dto.js';

@Controller({ version: '1', path: 'authorize' })
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Get()
  index(@Query() authorizationResponseDto: AuthorizationResponseDto) {
    const validationResult = this.authorizationService.validate(
      authorizationResponseDto,
    );

    return validationResult;
  }
}
