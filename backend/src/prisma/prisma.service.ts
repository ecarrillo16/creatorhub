import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { EnvironmentConfig } from 'src/config/configuration';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService<EnvironmentConfig>) {
    // Obtener la cadena de conexión desde las variables de entorno de forma seguraddcddd
    const connectionString = configService.get('database.url', { infer: true });
    const pool = new Pool({ connectionString });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexión a la base de datos establecida exitosamente.');
    } catch (error) {
      this.logger.error('Error al conectar a la base de datos:', error);
      throw error; // Re-lanzar el error para que NestJS lo maneje
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Conexión a la base de datos cerrada.');
  }
}
