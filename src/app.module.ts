import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { configModule } from './config/config';
import { BoardModule } from './board/board.module';
import { BoardMemberModule } from './board-member/board-member.module';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [configModule, PrismaModule, AuthModule, BoardModule, BoardMemberModule, ColumnModule, TaskModule],
  controllers: [],
  providers: []
})
export class AppModule {}
