import { User } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUser {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(createUserDto: CreateUserDto): Promise<User[]>;
}
