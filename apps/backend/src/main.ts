import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { EnvironmentConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 1. Prefijos para rutas
  app.setGlobalPrefix('api'); // Agrega un prefijo global para todas las rutas

  // 2. Activar Versionamiento de tipo URI
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Por defecto todas las rutas serán v1
  });

  // 3. Validación global con pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs
    }),
  );

  // 4. Filtro de excepciones global
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Interceptors globales (ejemplo: logging)
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 6. Swagger - Documentación de la API
  const config = new DocumentBuilder()
    .setTitle('CreatorHub API')
    .setDescription(
      'Documentación oficial de la API para gestión de recursos de creadores',
    )
    .setVersion('1.0') // Versión del documento
    .addServer('/api/v1') // Ayuda a Swagger a saber la base real
    .addTag('resources') // Agrupa tus rutas por etiquetas
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // La URL será /api/docs

  // 7. Extraer el puerto de las variables de entorno con un valor por defecto
  const configService =
    app.get<ConfigService<EnvironmentConfig>>(ConfigService);
  const port = configService.get('port', { infer: true }) || 3000;

  // 8. Iniciar servidor
  await app.listen(port);
  logger.log(`Servidor escuchando en: http://localhost:${port}/api`);
}
bootstrap();
