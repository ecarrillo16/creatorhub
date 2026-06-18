import { Resource } from '../../generated/prisma/client'; // Importa el tipo generado por Prisma
import { ResourceResponseDto } from '../dto/resource-response.dto';

/**
 * Mapper para transformar entidades Resource de Prisma
 * a DTOs de respuesta para el cliente.
 *
 * Responsabilidades:
 * - Formatear datos (ej: fechas, strings en mayúsculas)
 * - Remover campos sensibles
 * - Estructurar la respuesta según lo esperado por el API
 */
export class ResourceMapper {
  /**
   * Transforma una entidad simple de la DB a un objeto de respuesta para el cliente
   */
  static toResponse(entity: Resource): ResourceResponseDto {
    return {
      id: entity.id,
      title: entity.title.toUpperCase(), // Transformación de negocio
      url: entity.url,
      description: entity.description || 'Sin descripción disponible',

      // Formateamos createdAt a algo más legible: "18 de marzo, 2026"
      publishedAt: entity.createdAt.toLocaleDateString('es-PA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),

      // Incluir la fecha de actualización
      updatedAt: entity.updatedAt.toLocaleDateString('es-PA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }

  /**
   * Transforma una lista de entidades (útil para el findAll)
   */
  static toResponseList(entities: Resource[]): ResourceResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
