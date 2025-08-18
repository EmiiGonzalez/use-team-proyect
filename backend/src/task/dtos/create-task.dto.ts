import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    description: 'ID de la columna',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsMongoId({ message: 'columnId debe ser un MongoId válido' })
  columnId: string;

  @ApiProperty({
    description: 'ID del tablero',
    example: '60d21b4667d0d8992e610c86'
  })
  @IsMongoId({ message: 'boardId debe ser un MongoId válido' })
  boardId: string;

  @ApiPropertyOptional({
    description: 'ID del creador',
    example: '60d21b4667d0d8992e610c87'
  })
  @IsOptional()
  @IsMongoId({ message: 'creatorId debe ser un MongoId válido' })
  creatorId?: string;

  @ApiProperty({
    description: 'Nombre de la tarea',
    example: 'Implementar login'
  })
  @IsString({ message: 'name debe ser un string' })
  @IsNotEmpty({ message: 'name no puede estar vacío' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Crear la pantalla de login y la lógica de autenticación'
  })
  @IsOptional()
  @IsString({ message: 'description debe ser un string' })
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Estado de la tarea',
    default: TaskStatus.TODO
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'status debe ser un valor válido de TaskStatusDto'
  })
  status?: TaskStatus = TaskStatus.TODO;

  @ApiProperty({ description: 'Posición de la tarea', example: 0 })
  @IsInt({ message: 'position debe ser un número entero' })
  @Min(0, { message: 'position debe ser mayor o igual a 0' })
  position: number;
}
