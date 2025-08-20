import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { useToken } from 'src/shared/util/use.token';
import { IUseToken } from 'src/auth/interfaces/auth.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { EventsService } from 'src/events/events.service';
import { BoardMemberService } from 'src/board-member/services/board.member.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : 'localhost:5173',
    credentials: true
  },
  namespace: 'board'
})
export class BoardGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  onModuleInit() {
    this.eventsService['eventEmitter'].on(
      'board_updated',
      (data: { boardId: string, userId: string }) => {
        this.notifyBoardUpdate(data.boardId, data.userId);
      }
    );
  }

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BoardGateway.name);
  private userSockets = new Map<string, Socket[]>();

  constructor(
    private readonly authService: AuthService,
    private readonly eventsService: EventsService,
    private readonly boardMemberService: BoardMemberService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization;

      if (!token) {
        client.emit('error', { message: 'Token no proporcionado' });
        client.disconnect();
        return;
      }

      const manageToken: IUseToken | string = useToken(token);

      if (typeof manageToken === 'string') {
        client.emit('error', { message: manageToken });
        client.disconnect();
        return;
      }

      if (manageToken.isExpired) {
        client.emit('error', { message: 'Token expirado' });
        client.disconnect();
        return;
      }

      const { sub } = manageToken;
      const user = await this.authService.findOneByIdForAuth(sub);
      client.data.user = user;

      // Agregar socket al mapa de usuarios
      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, []);
      }
      this.userSockets.get(user.id)!.push(client);

      // Unir a rooms de boards donde es owner o miembro
      const boards = await this.boardMemberService.findAll({ userId: user.id });
      const boardIds = boards.map((bm) => bm.boardId);

      for (const boardId of boardIds) {
        client.join(`board_${boardId}`);
      }

      this.logger.log(
        `Usuario ${user.email} conectado con socket ${client.id} y unido a boards: ${boardIds.join(', ')}`
      );
    } catch (error) {
      this.logger.error(`Error en conexión: ${error.message}`);
      client.emit('error', { message: 'Conexión no autorizada' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      const userSocketList = this.userSockets.get(user.id);
      if (userSocketList) {
        const index = userSocketList.indexOf(client);
        if (index > -1) {
          userSocketList.splice(index, 1);
        }

        if (userSocketList.length === 0) {
          this.userSockets.delete(user.id);
        }
      }

      this.logger.log(`Usuario ${user.email} desconectado`);
    }
  }

  // Método público para notificar cambios en un board (id) y el usuario que realizó el cambio
  notifyBoardUpdate(boardId: string, userId: string) {
    this.server.to(`board_${boardId}`).emit('board_updated', { boardId, userId });
  }
}
