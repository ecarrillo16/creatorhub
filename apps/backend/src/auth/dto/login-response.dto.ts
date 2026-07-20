import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'john@example.com',
      name: 'John Doe',
      isActive: true,
      createdAt: '18 de marzo, 2026',
      updatedAt: '18 de marzo, 2026',
    },
    description: 'Información del usuario autenticado',
  })
  user: UserResponseDto;
}
