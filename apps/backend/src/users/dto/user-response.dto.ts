import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único del usuario',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email del usuario',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: '18 de marzo, 2026',
    description: 'Fecha de creación del recurso (formateada)',
  })
  createdAt: string;

  @Expose()
  @ApiProperty({
    example: '18 de marzo, 2026',
    description: 'Fecha de actualización del recurso (formateada)',
  })
  updatedAt: string;
}
