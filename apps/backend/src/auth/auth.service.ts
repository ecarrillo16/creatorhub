import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException('La contraseña es requerida');
    }

    return await bcrypt.hash(password, AuthService.SALT_ROUNDS);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!plainPassword || !hashedPassword) {
      throw new BadRequestException('Las credenciales son inválidas');
    }

    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
