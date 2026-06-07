import { User } from '../../generated/prisma/client';
import { UserResponseDto } from '../dto/user-response.dto';

export class UsersMapper {
  /**
   * Transforma una entidad simple de la DB a un objeto de respuesta para el cliente
   */
  static toResponse(entity: User): UserResponseDto {
    return {
      id: entity.id,
      username: entity.username || 'Sin nombre de usuario',
      email: entity.email,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toLocaleDateString('es-PA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
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
  static toResponseList(entities: User[]): UserResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
