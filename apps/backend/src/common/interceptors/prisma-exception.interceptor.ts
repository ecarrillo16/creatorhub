import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  ConflictException,
  InternalServerErrorException,
  HttpException,
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

  intercept<T>(_: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        const error = err;

        return this.privateHandleException(error);
      }),
    );
  }

  private privateHandleException(error: unknown): never {
    // Manejo específico de errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(error);
    }

    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof Error) {
      this.logger.error(`Error inesperado: ${error.message}`, error.stack);
    } else {
      this.logger.error('Error inesperado');
    }

    throw new InternalServerErrorException(
      'Error inesperado al procesar la solicitud',
    );
  }

  private handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
  ): never {
    const stack = error.stack || 'No stack trace available';

    // P2002: Violación de restricción única (unique constraint)
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] ?? 'campo';

      this.logger.warn(
        `Intento de crear registro duplicado en campo: ${field}`,
      );
      throw new ConflictException(`Ya existe un registro con este ${field}`);
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
}
