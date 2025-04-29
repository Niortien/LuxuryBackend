import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HachageModule } from 'src/hachage/hachage.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [HachageModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
