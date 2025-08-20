import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { TaskColumnController } from './controllers/task.column.controller';

@Module({
  providers: [TaskService],
  controllers: [TaskController, TaskColumnController]
})
export class TaskModule {}
