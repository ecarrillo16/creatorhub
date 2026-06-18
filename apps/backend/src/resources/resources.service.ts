import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { ResourceResponseDto } from './dto/resource-response.dto';
import { ResourceMapper } from './mapper/resource.mapper';

/**
 * Servicio de recursos.
 *
 * Nota: Los errores de Prisma son convertidos automáticamente por
 * PrismaExceptionInterceptor (P2002 → ConflictException, etc.).
 * Este servicio solo contiene lógica de negocio, sin try/catch.
 */
@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createResourceDto: CreateResourceDto,
  ): Promise<ResourceResponseDto> {
    // Validación básica
    if (!createResourceDto.title) {
      throw new BadRequestException('El título del recurso es requerido');
    }

    this.logger.log(`Creando nuevo recurso: ${createResourceDto.title}`);

    // El interceptor convertirá automáticamente P2002 en ConflictException
    const resource = await this.prisma.resource.create({
      data: createResourceDto,
    });

    // Mapear la entidad a DTO de respuesta
    return ResourceMapper.toResponse(resource);
  }

  async update(
    id: string,
    updateResourceDto: CreateResourceDto,
  ): Promise<ResourceResponseDto> {
    // Validación básica
    if (!id) {
      throw new BadRequestException('El ID del recurso es requerido');
    }

    this.logger.log(`Actualizando recurso con ID: ${id}`);

    const existing = await this.prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }

    // El interceptor convertirá automáticamente P2002 en ConflictException
    const resource = await this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
    });

    // Mapear la entidad a DTO de respuesta
    return ResourceMapper.toResponse(resource);
  }

  async remove(id: string): Promise<{ message: string }> {
    // Validación básica
    if (!id) {
      throw new BadRequestException('El ID del recurso es requerido');
    }

    this.logger.log(`Eliminando recurso con ID: ${id}`);

    const existing = await this.prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }

    await this.prisma.resource.delete({ where: { id } });
    return { message: 'Recurso eliminado exitosamente' };
  }

  async findAll(): Promise<ResourceResponseDto[]> {
    this.logger.log('Obteniendo todos los recursos');

    const resources = await this.prisma.resource.findMany();
    return ResourceMapper.toResponseList(resources);
  }

  async findOne(id: string): Promise<ResourceResponseDto> {
    // Validación básica
    if (!id) {
      throw new BadRequestException('El ID del recurso es requerido');
    }

    this.logger.log(`Obteniendo recurso con ID: ${id}`);

    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }

    return ResourceMapper.toResponse(resource);
  }
}
