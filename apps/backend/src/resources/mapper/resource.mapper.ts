import { Resource } from 'src/generated/prisma/client'; // Importa el tipo generado por Prisma
import { ResourceResponseDto } from '../dto/resource-response.dto';

export class ResourceMapper {
  /**
   * Transforma una entidad simple de la DB a un objeto de respuesta para el cliente
   */
  static toResponse(entity: Resource): ResourceResponseDto {
    return {
      id: entity.id,
      title: entity.title.toUpperCase(), // Ejemplo de transformación de negocio
      url: entity.url,
      description: entity.description || 'Sin descripción disponible',
      
      // Formateamos la fecha a algo más profesional: "18 de marzo, 2026"
      publishedAt: entity.createdAt.toLocaleDateString('es-PA', {
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
