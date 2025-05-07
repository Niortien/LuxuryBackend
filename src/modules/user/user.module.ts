import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { RoleGuard } from './guards/role.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, RoleGuard],
  exports: [UserService]
})
export class UserModule { }
