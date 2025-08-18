import { Module } from '@nestjs/common';
import { ColumnController } from './controllers/column.controller';
import { ColumnService } from './services/column.service';

@Module({
  providers: [ColumnService],
  controllers: [ColumnController]
})
export class ColumnModule {}
