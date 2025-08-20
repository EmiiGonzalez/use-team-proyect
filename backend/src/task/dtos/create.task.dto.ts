import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
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
  @IsString({ message: 'description debe ser un string' })
  description: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Estado de la tarea',
    default: TaskStatus.TODO
  })
  @IsEnum(TaskStatus, {
    message: 'status debe ser un valor válido de TaskStatusDto'
  })
  status: TaskStatus = TaskStatus.TODO;
}
