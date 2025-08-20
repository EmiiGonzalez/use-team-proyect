
import { Module } from '@nestjs/common';
import { ColumnController } from './controllers/column.controller';
import { ColumnService } from './services/column.service';
import { EventsModule } from '../events/event.module';

@Module({
  imports: [EventsModule],
  providers: [ColumnService],
  controllers: [ColumnController]
})
export class ColumnModule {}
