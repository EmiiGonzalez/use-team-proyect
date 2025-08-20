import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { EventsService } from 'src/events/events.service';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { UpdateBoardDto } from '../dtos/update-board.dto';
import { BoardResponseDto } from '../dtos/board-response.dto';
import { IUserRequest } from 'src/auth/decorators/get.user.decorator';
import { Board, BoardMember } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService
  ) {}

  /**
   * Crea un nuevo tablero
   */
  async create(
    dto: CreateBoardDto,
    user: IUserRequest
  ): Promise<BoardResponseDto> {
    const board: Board = await this.prisma.board.create({
      data: {
        name: dto.name,
        ownerId: user.id
      }
    });
    await this.prisma.boardMember.create({
      data: { boardId: board.id, userId: user.id, role: 'OWNER' }
    })
    // Notificar a los usuarios del board
    this.eventsService.pub('board_updated', { boardId: board.id });
    return new BoardResponseDto(board);
  }

  /**
   * Obtiene un tablero por su ID
   */

  async findOne(id: string, userId: string): Promise<BoardResponseDto> {
    const board = await this.prisma.board.findUnique({ where: { id } });
    const boardMembers : BoardMember[] = await this.prisma.boardMember.findMany({
      where: { boardId: id }
    });

    const userBoardMember = boardMembers.find((member) => member.userId === userId);

    if (!userBoardMember) {
      throw new ForbiddenException('No tienes acceso a este tablero');
    }

    if (!board) throw new NotFoundException('Board not found');
    return new BoardResponseDto(board);
  }

  /**
   * Obtiene todos los tableros del usuario o a los que pertenece
   */
  async findAll(user: IUserRequest): Promise<BoardResponseDto[]> {
    const boards = await this.prisma.board.findMany({
      where: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }]
      }
    });
    return boards.map((board) => new BoardResponseDto(board));
  }

  /**
   * Actualiza un tablero existente
   */

  async update(
    id: string,
    dto: UpdateBoardDto,
    user: IUserRequest
  ): Promise<BoardResponseDto> {
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) throw new NotFoundException('No existe un tablero con ese ID');

    if (board.ownerId !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este tablero'
      );
    }

    const updatedBoard = await this.prisma.board.update({
      where: { id },
      data: {
        name: dto.name,
        updatedAt: new Date()
      }
    });

    // Notificar a los usuarios del board
    this.eventsService.pub('board_updated', { boardId: updatedBoard.id });
    return new BoardResponseDto(updatedBoard);
  }
}
