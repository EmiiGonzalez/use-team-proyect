import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateTaskDto } from '../dtos/create.task.dto';
import { UpdateTaskDto, UpdateTasksPositionDto } from '../dtos/update.task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto, columnId: string, boardId: string, idUser: string) {
    // busco el numero de la ultima tarea creada
    const lastOrderTask = await this.prisma.task.findFirst({
      where: { columnId: columnId },
      orderBy: { position: 'desc' }
    });
    
    return this.prisma.task.create({ data : {
      boardId: boardId,
      columnId: columnId,
      creatorId: idUser,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      position: lastOrderTask ? lastOrderTask.position + 1 : 1
    } });
  }

  async findOne(id: string) {
    const found = await this.prisma.task.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Task no encontrada');
    return found;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.ensureExists(id);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async updatePosition(boardId: string, dto: UpdateTasksPositionDto) {
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

      const tasks = await this.prisma.task.findMany({ where: { boardId } });

      if (tasks.length !== dto.tasks.length) {
        throw new BadRequestException(
          'El número de tareas a actualizar no coincide'
        );
      }

      const updatePromises = dto.tasks.map((item) => {
        const task = tasks.find((col) => col.id === item.taskId);
        if (!task) throw new NotFoundException('Tarea no encontrada');
        return this.prisma.task.update({
          where: { id: task.id },
          data: { position: item.position }
        });
      });
  
      return Promise.all(updatePromises);
    }
  

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.task.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.task.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Task no encontrada');
  }
}
