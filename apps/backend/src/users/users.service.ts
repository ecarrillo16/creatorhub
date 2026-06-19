import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersMapper } from './mapper/users.mapper';

/**
 * Servicio de usuarios.
 *
 * Nota: Los errores de Prisma son convertidos automáticamente por
 * PrismaExceptionInterceptor (P2002 → ConflictException, etc.).
 * Este servicio solo contiene lógica de negocio, sin try/catch.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Validación básica
    if (!createUserDto.email) {
      throw new BadRequestException('El email es requerido');
    }

    this.logger.log(`Creando nuevo usuario con email: ${createUserDto.email}`);

    // El interceptor convertirá automáticamente P2002 en ConflictException
    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );

    const response = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // Mapear la entidad a DTO de respuesta
    return UsersMapper.toResponse(response);
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Obteniendo todos los usuarios');

    const response = await this.prisma.user.findMany();
    return UsersMapper.toResponseList(response);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    // Validación básica
    if (!id) {
      throw new BadRequestException('El ID del usuario es requerido');
    }

    this.logger.log(`Obteniendo usuario con ID: ${id}`);

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return UsersMapper.toResponse(user);
  }

  async update(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    // Validación básica
    if (!id) {
      throw new BadRequestException('El ID del usuario es requerido');
    }

    this.logger.log(`Actualizando usuario con ID: ${id}`);

    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // El interceptor convertirá automáticamente P2002 en ConflictException
    const password = updateUserDto.password
      ? await this.authService.hashPassword(updateUserDto.password)
      : existing.password;

    const response = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password,
      },
    });

    return UsersMapper.toResponse(response);
  }

  async remove(id: string): Promise<{ message: string }> {
    // Validación básica
    if (!id) {
      throw new BadRequestException('El ID del usuario es requerido');
    }

    this.logger.log(`Eliminando usuario con ID: ${id}`);

    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Usuario eliminado exitosamente' };
  }
}
