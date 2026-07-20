import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategyInterceptor extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del header 'Authorization: Bearer <TOKEN>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rechaza el token si ya expiró
      secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_CAMBIAME',
    });
  }

  // Si el token es válido, Passport decorará el objeto 'Request' inyectando lo que retorne este método en 'req.user'
  public validate(payload: any) {
    // Puedes realizar validaciones adicionales aquí (ej. buscar si el usuario sigue activo en la DB)
    return { userId: payload.sub, email: payload.email };
  }
}
