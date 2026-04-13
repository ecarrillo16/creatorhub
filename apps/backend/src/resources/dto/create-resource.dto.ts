import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'Guía de NestJS', description: 'Título del recurso' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Nueva descripción' })
  description?: string;

  @IsUrl({}, { message: 'La URL del recurso debe ser válida' })
  @ApiProperty({
    example: 'https://docs.nestjs.com',
    description: 'URL del sitio',
  })
  url: string;
}
