import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { CreateTaskDto } from '../dtos/create.task.dto';
import { ListTasksQueryDto } from '../dtos/list.task.query.dto';
import { UpdateTaskDto } from '../dtos/update.task.dto';
import { TaskAccessGuard } from 'src/auth/guards/task.access.guard';
import { GetUser } from 'src/auth/decorators/get.user.decorator';
import type { IUserRequest } from 'src/auth/decorators/get.user.decorator';
import { GetIdBoard } from 'src/auth/decorators/get.idboard.decorator';

@UseGuards(AuthGuard, TaskAccessGuard)
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  /**
   * Crea una nueva tarea
   * @param dto Datos para crear la tarea
   * @param id ID de la columna a la que pertenece la tarea
   */
  @Post('/:id')
  @ApiOperation({
    summary: 'Crear una nueva tarea',
    description: 'Crea una nueva tarea en una columna y tablero específicos.'
  })
  @ApiParam({ name: 'id', description: 'ID de la columna', type: String })
  @ApiResponse({
    status: 201,
    description: 'Tarea creada',
    type: CreateTaskDto
  })
  @ApiBody({ type: CreateTaskDto })
  create(
    @Param('id') id: string,
    @Body() dto: CreateTaskDto,
    @GetUser() user: IUserRequest,
    @GetIdBoard() idBoard: string
  ) {
    return this.service.create(dto, id, idBoard, user.id);
  }

  /**
   * Obtiene una tarea por ID
   * @param id ID de la tarea
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una tarea por ID',
    description: 'Obtiene la información de una tarea específica.'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: String })
  @ApiResponse({
    status: 200,
    description: 'Tarea encontrada',
    type: CreateTaskDto
  })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Actualiza una tarea
   * @param id ID de la tarea
   * @param dto Datos de actualización
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea',
    description: 'Actualiza los datos de una tarea específica.'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: String })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada',
    type: UpdateTaskDto
  })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  /**
   * Elimina una tarea
   * @param id ID de la tarea
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tarea',
    description: 'Elimina una tarea específica.'
  })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: String })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
