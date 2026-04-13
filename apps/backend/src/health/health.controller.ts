import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger/dist/decorators/api-exclude-controller.decorator';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator, // Valida el uso de memoria de la aplicación
    private disk: DiskHealthIndicator, // Valida el uso de disco de la aplicación
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 1. Verificar la conexión a la base de datos
      async () => this.db.pingCheck('database', this.prismaService),

      // 2. Verificar el uso de memoria (ejemplo: no más del 150MB)
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // 3. Verificar el uso de memoria RSS (ejemplo: no más del 200MB)
      async () => this.memory.checkRSS('memory_rss', 200 * 1024 * 1024),

      // 4. Verificar el uso de disco (ejemplo: no más del 90% de uso)
      async () =>
        this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }
}
