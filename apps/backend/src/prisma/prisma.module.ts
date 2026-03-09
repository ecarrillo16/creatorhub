import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que no tengas que importarlo en cada módulo individualmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exportamos para que otros servicios lo usen
})
export class PrismaModule {}
