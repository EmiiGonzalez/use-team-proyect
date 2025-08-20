import {
  Injectable,
  NotFoundException} from '@nestjs/common';
import {
  CreateColumnDto,
  UpdateColumnDto,
  ColumnDto
} from '../dtos/column.dtos';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { EventsService } from 'src/events/events.service';
import { Column } from '@prisma/client';

@Injectable()
export class ColumnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService
  ) {}

  async create(idBoard: string, dto: CreateColumnDto) {
    const column = await this.prisma.column.create({
      data: {
        name: dto.name,
        boardId: idBoard
      }
    });
    this.eventsService.pub('board_updated', { boardId: idBoard });
    return column;
  }

  async findAll(boardId: string) {
    const columns = await this.prisma.column.findMany({
      where: { boardId },
      include: {
        tasks: true
      }
    });

    return columns.map((col) => new ColumnDto(col));
  }

  async findOne(id: string) {
    const found = await this.prisma.column.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Column no encontrada');
    return found;
  }

  async update(id: string, dto: UpdateColumnDto) {
    const column = await this.ensureExists(id);
    const updated = await this.prisma.column.update({
      where: { id },
      data: dto
    });
    this.eventsService.pub('board_updated', { boardId: column.boardId });
    return updated;
  }

  async remove(id: string) {
    await this.prisma.task.deleteMany({ where: { columnId: id } });
    const column = await this.ensureExists(id);
    this.eventsService.pub('board_updated', { boardId: column.boardId });
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
