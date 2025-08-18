import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { TasksController } from './controllers/controllers.controller';

@Module({
  providers: [ServicesService],
  controllers: [TasksController]
})
export class TaskModule {}
