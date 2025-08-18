import { Module } from '@nestjs/common';
import { ServicesService } from './services/board.member.service';
import { ControllersController } from 'src/column/controllers/controllers.controller';

@Module({
  providers: [ServicesService],
  controllers: [ControllersController]
})
export class BoardMemberModule {}
