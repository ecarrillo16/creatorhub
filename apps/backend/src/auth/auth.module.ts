import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { CryptoService } from 'src/shared/crypto/crypto.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, CryptoService],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_CAMBIAME', // Usa variables de entorno en producción
      signOptions: { expiresIn: '1h' }, // El token expirará en 1 hora
    }),
  ],
})
export class AuthModule {}
