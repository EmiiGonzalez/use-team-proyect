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
import { IUserRequest } from 'src/auth/decorators/get.user.decorators';
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
        position: dto.position
      }
    });
  }

  async findAll(boardId: string) {
    const columns = await this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
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

  async updatePosition(boardId: string, dto: ListUpdatePositionDto[]) {
    const positions = dto.map((item) => item.position);
    const seen = new Set<number>();
    for (const pos of positions) {
      if (seen.has(pos)) {
        throw new BadRequestException(
          'No se permiten posiciones duplicadas en las columnas'
        );
      }
      seen.add(pos);
    }

    const columns = await this.prisma.column.findMany({ where: { boardId } });

    if (columns.length !== dto.length) {
      throw new BadRequestException(
        'El número de columnas a actualizar no coincide'
      );
    }

    const updatePromises = dto.map((item) => {
      const column = columns.find((col) => col.id === item.columnId);
      if (!column) throw new NotFoundException('Columna no encontrada');
      return this.prisma.column.update({
        where: { id: column.id },
        data: { position: item.position }
      });
    });

    return Promise.all(updatePromises);
  }

  async remove(id: string) {
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
