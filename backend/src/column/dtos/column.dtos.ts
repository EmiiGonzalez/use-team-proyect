import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Task } from '@prisma/client';
import { TaskResponseDto } from 'src/task/dtos/task.response.dto';

export class CreateColumnDto {
  @ApiProperty({ example: 'To Do', description: 'Nombre de la columna' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name: string;

  @ApiProperty({
    example: 0,
    description: 'Posición de la columna en el board'
  })
  @IsInt({ message: 'La posición debe ser un número entero.' })
  @Min(0, { message: 'La posición debe ser mayor o igual a 0.' })
  position: number;
}

export class UpdateColumnDto {
  @ApiPropertyOptional({
    example: 'Doing',
    description: 'Nuevo nombre de la columna'
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name?: string;
}

export class ListUpdatePositionDto {
  @ApiProperty({
    example: '64e1b2c3f4a5b6c7d8e9f0a2',
    description: 'ID de la columna a actualizar'
  })
  @IsMongoId({ message: 'El columnId debe ser un MongoId válido.' })
  columnId: string;

  @ApiProperty({ example: 1, description: 'Nueva posición de la columna' })
  @IsInt({ message: 'La posición debe ser un número entero.' })
  @Min(0, { message: 'La posición debe ser mayor o igual a 0.' })
  position: number;
}

type ColumnWithTasks = Column & { tasks: Task[] };

export class ColumnDto {
  @ApiProperty({
    example: '64e1b2c3f4a5b6c7d8e9f0a2',
    description: 'ID de la columna'
  })
  id: string;

  @ApiProperty({ example: 'Doing', description: 'Nombre de la columna' })
  name: string;

  @ApiProperty({ example: 1, description: 'Posición de la columna' })
  position: number;

  tasks: TaskResponseDto[];

  constructor(column: ColumnWithTasks) {
    this.id = column.id;
    this.name = column.name;
    this.position = column.position;
    this.tasks = column.tasks.map(task => new TaskResponseDto(task));
  }
}