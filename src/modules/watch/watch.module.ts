import { Module } from '@nestjs/common';
import { WatchService } from './services/watch.service';
import { WatchController } from './controllers/watch.controller';

@Module({
  controllers: [WatchController],
  providers: [WatchService],
})
export class WatchModule { }
