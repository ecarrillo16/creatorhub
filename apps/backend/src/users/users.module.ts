import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CryptoService } from 'src/shared/crypto/crypto.service';

@Module({
  imports: [AuthModule],
  providers: [UsersService, CryptoService],
  controllers: [UsersController],
})
export class UsersModule {}
