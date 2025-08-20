import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Task, TaskStatus } from '@prisma/client';

export class TaskResponseDto {
  @ApiProperty({
    description: 'ID de la tarea',
    example: '60d21b4667d0d8992e610c84'
  })
  id: string;

  @ApiProperty({
    description: 'ID de la columna',
    example: '60d21b4667d0d8992e610c85'
  })
  columnId: string;

  @ApiProperty({
    description: 'ID del tablero',
    example: '60d21b4667d0d8992e610c86'
  })
  boardId: string;

  @ApiPropertyOptional({
    description: 'ID del creador',
    example: '60d21b4667d0d8992e610c87'
  })
  creatorId?: string;

  @ApiProperty({
    description: 'Nombre de la tarea',
    example: 'Implementar login'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Crear la pantalla de login y la lógica de autenticación'
  })
  description: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Estado de la tarea',
    default: TaskStatus.TODO
  })
  status?: TaskStatus = TaskStatus.TODO;

  @ApiProperty({ description: 'Posición de la tarea', example: 0 })
  position: number;

  @ApiProperty({
    description: 'Fecha de creación de la tarea',
    example: '2021-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  constructor(task: Task) {
    this.id = task.id;
    this.columnId = task.columnId;
    this.boardId = task.boardId;
    task.creatorId
      ? (this.creatorId = task.creatorId)
      : (this.creatorId = undefined);
    this.name = task.name;
    task.description && (this.description = task.description);
    this.status = task.status;
    this.position = task.position;
    this.createdAt = task.createdAt;
  }
}
