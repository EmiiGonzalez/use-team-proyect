import { Module } from '@nestjs/common';
import { BoardGateway } from './gateway/socket.gateway';
import { BoardMemberModule } from '../board-member/board-member.module';
import { EventsModule } from 'src/events/event.module';

@Module({
  imports: [BoardMemberModule, EventsModule],
  providers: [BoardGateway],
  exports: [BoardGateway]
})
export class SocketModule {}
