import { Module } from '@nestjs/common';
import { BoardMemberService } from './services/board.member.service';
import { BoardMemberController } from './controllers/board.member.controller';

@Module({
  providers: [BoardMemberService],
  controllers: [BoardMemberController]
})
export class BoardMemberModule {}
