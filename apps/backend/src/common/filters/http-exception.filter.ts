import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Atrapa todas las excepciones
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinamos el status: ¿Es un error conocido de Nest o un error de código puro?
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraemos el mensaje de error de forma segura
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // Si Nest devuelve un objeto (como en ValidationPipe), lo aplanamos
      message: (message as any).message || message,
      error: (message as any).error || 'Error',
    };

    // LOG PROFESIONAL: Registramos el error para el equipo de infraestructura
    this.logger.error(
      `HTTP Error: ${status} | Path: ${request.url} | Message: ${JSON.stringify(message)}`,
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? (exception as Error).stack
        : '',
    );

    response.status(status).json(errorResponse);
  }
}
