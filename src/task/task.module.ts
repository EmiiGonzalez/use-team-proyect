import { Module } from '@nestjs/common';
import { ServicesService } from './controllers/services.service';
import { ControllersController } from './controllers.controller';

@Module({
  providers: [ServicesService],
  controllers: [ControllersController]
})
export class TaskModule {}
