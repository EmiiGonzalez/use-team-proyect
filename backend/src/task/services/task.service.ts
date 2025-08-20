import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/service/prisma.service';
import { EventsService } from 'src/events/events.service';
import { CreateTaskDto } from '../dtos/create.task.dto';
import {
  UpdateTaskDto,
  UpdateTaskPositionInDiferentColumns,
  UpdateTasksPositionDto
} from '../dtos/update.task.dto';
import { Task } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService
  ) {}

  async create(
    dto: CreateTaskDto,
    columnId: string,
    boardId: string,
    idUser: string
  ) {
    // busco el numero de la ultima tarea creada
    const lastOrderTask = await this.prisma.task.findFirst({
      where: { columnId: columnId },
      orderBy: { position: 'desc' }
    });

    const task = await this.prisma.task.create({
      data: {
        boardId: boardId,
        columnId: columnId,
        creatorId: idUser,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        position: lastOrderTask ? lastOrderTask.position + 1 : 1
      }
    });
    this.eventsService.pub('board_updated', { boardId });
    return task;
  }

  async findOne(id: string) {
    const found = await this.prisma.task.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Task no encontrada');
    return found;
  }

  async update(idColumn: string, dto: UpdateTaskDto, idUser: string) {
    const task: Task = await this.ensureExists(dto.id);

    if (idColumn != task.columnId) {
      const column = await this.prisma.column.findUnique({
        where: { id: task.columnId }
      });
      if (!column) throw new NotFoundException('Columna no encontrada');

      const isMember = await this.prisma.boardMember.findUnique({
        where: { boardId_userId: { boardId: column.boardId, userId: idUser } }
      });

      const board = await this.prisma.board.findUnique({
        where: { id: column.boardId }
      });
      const isOwner = board?.ownerId == idUser;
      if (!isMember && !isOwner)
        throw new NotFoundException('Usuario no es miembro del tablero');
    }

    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        columnId: dto.columnId,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        position:
          dto.position < 0 ? -Math.abs(dto.position) : Math.abs(dto.position)
      }
    });
    this.eventsService.pub('board_updated', { boardId: task.boardId });
    return updated;
  }
  async updateSimpleData(idColumn: string, dto: UpdateTaskDto, idUser: string) {
    const task: Task = await this.ensureExists(dto.id);

    if (idColumn != task.columnId) {
      const column = await this.prisma.column.findUnique({
        where: { id: task.columnId }
      });
      if (!column) throw new NotFoundException('Columna no encontrada');

      const isMember = await this.prisma.boardMember.findUnique({
        where: { boardId_userId: { boardId: column.boardId, userId: idUser } }
      });

      const board = await this.prisma.board.findUnique({
        where: { id: column.boardId }
      });
      const isOwner = board?.ownerId == idUser;
      if (!isMember && !isOwner)
        throw new NotFoundException('Usuario no es miembro del tablero');
    }

    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
      }
    });
    this.eventsService.pub('board_updated', { boardId: task.boardId });
    return updated;
  }

  async updatePosition(dto: UpdateTasksPositionDto) {
    const positions = dto.tasks.map((item) => item.position);
    const seen = new Set<number>();
    for (const pos of positions) {
      if (seen.has(pos)) {
        throw new BadRequestException(
          'No se permiten posiciones duplicadas en las columnas'
        );
      }
      seen.add(pos);
    }

    const tasks = await this.prisma.task.findMany({
      where: { id: { in: dto.tasks.map((item) => item.taskId) } }
    });

    for (const item of dto.tasks) {
      const task = tasks.find((col) => col.id === item.taskId);
      if (!task) throw new NotFoundException('Tarea no encontrada');
      await this.prisma.task.update({
        where: { id: task.id },
        data: { position: item.position }
      });
    }
    return { message: 'Posiciones actualizadas correctamente' };
  }

  /**
   * @description Actualiza la posición de dos tareas que se encuentran en diferentes columnas.
   */
  async updatePositionInOtherColumn(
    dto: UpdateTaskPositionInDiferentColumns,
    idUser: string
  ) {
    const columns = await this.prisma.column.findMany({
      where: { id: { in: [dto.taskA.columnId, dto.taskB.columnId] } }
    });

    for (const column of columns) {
      const isMember = await this.prisma.boardMember.findUnique({
        where: { boardId_userId: { boardId: column.boardId, userId: idUser } }
      });

      const board = await this.prisma.board.findUnique({
        where: { id: column.boardId }
      });
      const isOwner = board?.ownerId == idUser;
      if (!isMember && !isOwner)
        throw new UnauthorizedException('Usuario no es miembro del tablero');
    }

    const taskA = await this.ensureExists(dto.taskA.taskId);
    const taskB = await this.ensureExists(dto.taskB.taskId);

    await this.prisma.task.update({
      where: { id: taskA.id },
      data: { position: dto.taskB.position, columnId: dto.taskB.columnId }
    });
    await this.prisma.task.update({
      where: { id: taskB.id },
      data: { position: dto.taskA.position, columnId: dto.taskA.columnId }
    });

    this.eventsService.pub('board_updated', { boardId: taskA.boardId });
    return { message: 'Posiciones actualizadas correctamente' };
  }

  async remove(id: string) {
    const task = await this.ensureExists(id);

    await this.prisma.task.delete({ where: { id } });
    this.eventsService.pub('board_updated', { boardId: task.boardId });
    return { message: 'Tarea eliminada correctamente' };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.task.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Task no encontrada');
    return exists;
  }
}
