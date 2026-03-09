import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { envVarsSchema } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // Carga la configuración personalizada
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
      validationSchema: envVarsSchema, // Aquí es donde ocurre la magia
      validationOptions: {
        allowUnknown: true, // Permite variables de entorno extra no definidas en el esquema
        abortEarly: true, // DEtiene el arranque al primer error encontrado
      },
    }),
    PrismaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
