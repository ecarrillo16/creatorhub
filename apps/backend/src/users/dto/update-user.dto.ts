import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El nombre de usuario solo puede contener letras y números',
  })
  @MaxLength(20, {
    message: 'El nombre de usuario no puede tener más de 20 caracteres',
  })
  @ApiProperty({
    example: 'juan_dev',
    description:
      'Nombre de usuario único (solo letras y números, máx 20 caracteres)',
  })
  username?: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico único del usuario',
  })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: 'MiPassword123',
    description: 'Contraseña (mínimo 8 caracteres)',
  })
  password?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: true,
    description: 'Estado del usuario - activo o inactivo (por defecto: true)',
  })
  isActive?: boolean;
}
