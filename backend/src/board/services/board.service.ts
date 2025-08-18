import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { UpdateBoardDto } from '../dtos/update-board.dto';
import { BoardResponseDto } from '../dtos/board-response.dto';
import { IUserRequest } from 'src/auth/decorators/get.user.decorators';
import { Board } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

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
    return new BoardResponseDto(board);
  }

  /**
   * Obtiene un tablero por su ID
   */

  async findOne(id: string): Promise<BoardResponseDto> {
    const board = await this.prisma.board.findUnique({ where: { id } });
    if (!board) throw new NotFoundException('Board not found');
    return new BoardResponseDto(board);
  }

  /**
   * Obtiene todos los tableros del usuario o a los que pertenece
   */
  async findAll(user: IUserRequest): Promise<BoardResponseDto[]> {
    const boards = await this.prisma.board.findMany({
      where: {
        ownerId: user.id,
        AND: { members: { some: { userId: user.id } } }
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

    return new BoardResponseDto(updatedBoard);
  }
}
