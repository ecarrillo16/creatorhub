import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { ResourceMapper } from './mapper/resource.mapper';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    try {
      this.logger.log(`Creando nuevo recurso: ${createResourceDto.title}`);

      return await this.prisma.resource.create({
        data: createResourceDto,
      });
    } catch (error) {
      // Manejo profesional de errores de base de datos
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un recurso con esta URL');
      }
      this.logger.error('Error al crear recurso', error.stack);
      throw new InternalServerErrorException(
        'Error inesperado al guardar el recurso',
      );
    }
  }

  async findAll() {
    const resources = await this.prisma.resource.findMany();

    return ResourceMapper.toResponseList(resources);
  }

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) return null;

    return ResourceMapper.toResponse(resource);
  }
}
