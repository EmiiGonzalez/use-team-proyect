import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {
  CreateColumnDto,
  UpdateColumnDto,
  ListUpdatePositionDto,
  ColumnDto
} from '../dtos/column.dtos';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { IUserRequest } from 'src/auth/decorators/get.user.decorator';
import { Column } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async create(idBoard: string, dto: CreateColumnDto) {
    return this.prisma.column.create({
      data: {
        name: dto.name,
        boardId: idBoard,
      }
    });
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
    await this.ensureExists(id);
    return this.prisma.column.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.task.deleteMany({ where: { columnId: id } });
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
