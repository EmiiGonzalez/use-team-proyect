import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {
  CreateColumnDto,
  UpdateColumnDto,
  ListColumnsQueryDto
} from '../dtos/column.dtos';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { IUserRequest } from 'src/auth/decorators/get.user.decorators';
import { Column } from '@prisma/client';

@Injectable()
export class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateColumnDto) {
    return this.prisma.column.create({
      data: {
        name: dto.name,
        boardId: dto.boardId,
        position: dto.position
      }
    });
  }

  async findAll(query: ListColumnsQueryDto) {
    const { boardId } = query;
    return this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' }
    });
  }

  async findOne(id: string) {
    const found = await this.prisma.column.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Column no encontrada');
    return found;
  }

  async update(id: string, dto: UpdateColumnDto) {
    await this.ensureExists(id);
    return this.prisma.column.update({ where: { id }, data: dto });
  }

  async remove(id: string, user: IUserRequest) {
    const column = await this.ensureExists(id);
    const board = await this.prisma.board.findUnique({
      where: { id: column.boardId }
    });
    if (board?.ownerId !== user.id) {
      throw new UnauthorizedException(
        'No tienes permiso para eliminar esta columna'
      );
    }
    return this.prisma.column.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<Column> {
    const exists: Column | null = await this.prisma.column.findUnique({
      where: { id }
    });
    if (!exists) throw new NotFoundException('Column no encontrada');
    return exists;
  }
}
