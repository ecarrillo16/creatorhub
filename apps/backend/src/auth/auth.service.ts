import { UsersMapper } from './../users/mapper/users.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from 'src/shared/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(
    email: string,
    password: string,
  ): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const passwordValid = await this.cryptoService.comparePasswords(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new Error('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };

    const response = {
      accessToken: this.jwtService.sign(payload),
      user: UsersMapper.toResponse(user),
    };

    return response;
  }
}
