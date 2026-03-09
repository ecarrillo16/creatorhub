import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 1. Prefijos para rutas
  app.setGlobalPrefix('api'); // Agrega un prefijo global para todas las rutas

  // 2. Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs
    }),
  );

  // 3. Extraer el puerto de las variables de entorno con un valor por defecto
  const configService = app.get<ConfigService<EnvironmentConfig>>(ConfigService);
  const port = configService.get('port', { infer: true }) || 3000;

  // 4. Iniciar servidor
  await app.listen(port);
  logger.log(`Servidor escuchando en: http://localhost:${port}/api`);
}
bootstrap();
