import { AuthService } from './auth.service';
import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAll() {}
}
