import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResourcesService } from 'src/resources/resources.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param createUserDto - DTO con los datos del nuevo usuario.
   * @returns El usuario creado.
   * @throws ConflictException si ya existe un usuario con el mismo correo electrónico.
   * @throws InternalServerErrorException si ocurre un error inesperado al crear el usuario.
   */
  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creando nuevo usuario');

    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error: unknown) {
      this.logger.error(
        'Error al crear usuario',
        error instanceof Error ? error.stack : String(error),
      );

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.message.includes('P2002')
      ) {
        throw new ConflictException(
          'Ya existe un usuario con este correo electrónico',
        );
      }

      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns Una lista de usuarios.
   */
  async findAll() {
    this.logger.log('Obteniendo todos los usuarios');

    try {
      return this.prisma.user.findMany();
    } catch (error: unknown) {
      this.logger.error(
        'Error al obtener usuarios',
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException('Error al obtener usuarios');
    }
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id - El ID del usuario a buscar.
   * @returns El usuario encontrado o null si no existe.
   */
  async findOne(id: string) {
    this.logger.log('Obteniendo usuario por ID');

    try {
      return this.prisma.user.findUnique({ where: { id } });
    } catch (error: unknown) {
      this.logger.error(
        'Error al obtener usuario',
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException('Error al obtener usuario');
    }
  }
}
