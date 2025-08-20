import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'ID de la tarea',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsMongoId({ message: 'id debe ser un MongoId válido' })
  id: string;

  @ApiPropertyOptional({
    description: 'ID de la columna',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsMongoId({ message: 'columnId debe ser un MongoId válido' })
  columnId: string;

  @ApiPropertyOptional({
    description: 'Nombre de la tarea',
    example: 'Implementar login'
  })
  @IsOptional()
  @IsString({ message: 'name debe ser un string' })
  @IsNotEmpty({ message: 'name no puede estar vacío' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Crear la pantalla de login y la lógica de autenticación'
  })
  @IsOptional()
  @IsString({ message: 'description debe ser un string' })
  description: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Estado de la tarea' })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'status debe ser un valor válido de TaskStatus'
  })
  status: TaskStatus;

  @ApiPropertyOptional({ description: 'Posición de la tarea', example: 0 })
  @IsOptional()
  @IsInt({ message: 'position debe ser un número entero' })
  @Min(0, { message: 'position debe ser mayor o igual a 0' })
  position: number;
}

class ListTaskPositionDto {
  @ApiPropertyOptional({
    description: 'ID de la tarea',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsNotEmpty({ message: 'taskId no puede estar vacío' })
  @IsMongoId({ message: 'taskId debe ser un MongoId válido' })
  taskId: string;

  @ApiPropertyOptional({
    description: 'Nueva posición de la tarea',
    example: 0
  })
  @IsNotEmpty({ message: 'position no puede estar vacío' })
  @IsInt({ message: 'position debe ser un número entero' })
  position: number;
}

export class UpdateTasksPositionDto {
  @ApiPropertyOptional({
    description: 'ID de la columna',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsNotEmpty({ message: 'columnId no puede estar vacío' })
  @IsMongoId({ message: 'columnId debe ser un MongoId válido' })
  columnId: string;

  @ApiPropertyOptional({
    description: 'Lista de tareas a actualizar',
    type: [ListTaskPositionDto]
  })
  @IsNotEmpty({ message: 'tasks no puede estar vacío' })
  @IsNotEmpty({ each: true, message: 'Cada tarea no puede estar vacía' })
  tasks: ListTaskPositionDto[];
}

class ListTaskPositionWithColumnDto extends ListTaskPositionDto {
  @ApiProperty({
    description: 'ID de la columna',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsNotEmpty({ message: 'columnId no puede estar vacío' })
  @IsMongoId({ message: 'columnId debe ser un MongoId válido' })
  columnId: string;
}

export class UpdateTaskPositionInDiferentColumns {
  @ApiProperty({
    description: 'Tarea A',
    type: ListTaskPositionWithColumnDto
  })
  @IsNotEmpty({ message: 'taskA no puede estar vacío' })
  taskA: ListTaskPositionWithColumnDto;

  @ApiProperty({
    description: 'Tarea B',
    type: ListTaskPositionWithColumnDto
  })
  @IsNotEmpty({ message: 'taskB no puede estar vacío' })
  taskB: ListTaskPositionWithColumnDto;
}
