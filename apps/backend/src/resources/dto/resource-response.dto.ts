import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para recursos.
 * Utilizado para documentar y estructurar la respuesta del API.
 *
 * El mapper (ResourceMapper) es responsable de transformar
 * entidades de Prisma a este formato.
 */
export class ResourceResponseDto {
  @Expose()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único del recurso',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'GUÍA DE NESTJS',
    description: 'Título del recurso (en mayúsculas)',
  })
  title: string;

  @Expose()
  @ApiProperty({
    example: 'https://docs.nestjs.com',
    description: 'URL del recurso',
  })
  url: string;

  @Expose()
  @ApiPropertyOptional({
    example: 'Una guía completa sobre NestJS',
    description: 'Descripción del recurso',
  })
  description?: string;

  @Expose()
  @ApiProperty({
    example: '18 de marzo, 2026',
    description: 'Fecha de creación del recurso (formateada)',
  })
  publishedAt: string;

  @Expose()
  @ApiProperty({
    example: '18 de marzo, 2026',
    description: 'Fecha de última actualización del recurso (formateada)',
  })
  updatedAt: string;
}
