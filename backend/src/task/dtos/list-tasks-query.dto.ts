import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMongoId, IsOptional, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class ListTasksQueryDto {
  @ApiPropertyOptional({
    description: 'ID del tablero',
    example: '60d21b4667d0d8992e610c86'
  })
  @IsOptional()
  @IsMongoId({ message: 'boardId debe ser un MongoId válido' })
  boardId?: string;

  @ApiPropertyOptional({
    description: 'ID de la columna',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsOptional()
  @IsMongoId({ message: 'columnId debe ser un MongoId válido' })
  columnId?: string;

  @ApiPropertyOptional({
    description: 'ID del creador',
    example: '60d21b4667d0d8992e610c87'
  })
  @IsOptional()
  @IsMongoId({ message: 'creatorId debe ser un MongoId válido' })
  creatorId?: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Estado de la tarea' })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'status debe ser un valor válido de TaskStatus'
  })
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Cantidad de tareas a omitir',
    example: 0,
    default: 0
  })
  @IsOptional()
  @IsInt({ message: 'skip debe ser un número entero' })
  @Min(0, { message: 'skip debe ser mayor o igual a 0' })
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Cantidad máxima de tareas a retornar',
    example: 50,
    default: 50
  })
  @IsOptional()
  @IsInt({ message: 'take debe ser un número entero' })
  @Min(1, { message: 'take debe ser mayor o igual a 1' })
  take?: number = 50;
}
