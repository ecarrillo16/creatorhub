import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { Prisma } from '../../generated/prisma/client';

/**
 * Interceptor que convierte automáticamente los errores de Prisma
 * en excepciones HTTP apropiadas.
 *
 * Uso: Registra globalmente en main.ts con app.useGlobalInterceptors()
 *
 * Ejemplo:
 * - Prisma P2002 (constraint unique) → ConflictException
 * - Otros errores de Prisma → InternalServerErrorException
 * - Excepciones HTTP → Se relanza sin cambios
 */
@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger('PrismaExceptionInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        // Manejo específico de errores de Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const stack = error.stack || 'No stack trace available';

          // P2002: Violación de restricción única (unique constraint)
          if (error.code === 'P2002') {
            const target = error.meta?.target as string[] | undefined;
            const field = target?.[0] ?? 'campo';

            this.logger.warn(
              `Intento de crear registro duplicado en campo: ${field}`,
            );
            throw new ConflictException(
              `Ya existe un registro con este ${field}`,
            );
          }

          // P2025: No se encontró el registro para la operación
          if (error.code === 'P2025') {
            this.logger.warn('Intento de operar sobre un registro inexistente');
            // Dejar que se maneje en el servicio con NotFoundException
            throw error;
          }

          // Otros errores de Prisma
          this.logger.error(
            `Error de Prisma [${error.code}]: ${error.message}`,
            stack,
          );
          throw new InternalServerErrorException(
            'Error inesperado al procesar la solicitud',
          );
        }

        // Si ya es una excepción HTTP, relanzarla sin cambios
        // (BadRequestException, NotFoundException, ConflictException, etc.)
        if (error.status && error.message) {
          throw error;
        }

        // Otros errores no previstos
        this.logger.error(
          `Error inesperado: ${error.message}`,
          error.stack || 'No stack trace available',
        );
        throw new InternalServerErrorException(
          'Error inesperado al procesar la solicitud',
        );
      }),
    );
  }
}
