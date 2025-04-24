import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WatchModule } from './modules/watch/watch.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, WatchModule, UserModule],
  providers: [],
})
export class AppModule { }
