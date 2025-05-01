import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WatchModule } from './modules/watch/watch.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
    }),

    DatabaseModule, WatchModule, UserModule, AuthModule],
  providers: [],
})
export class AppModule { }