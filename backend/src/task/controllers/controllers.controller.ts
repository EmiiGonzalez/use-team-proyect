import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ColumnAccessGuard } from 'src/auth/guards/column.access.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { ListTasksQueryDto } from '../dtos/list-tasks-query.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@UseGuards(AuthGuard, ColumnAccessGuard)
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  /**
   * Crea una nueva tarea
   * @param dto Datos para crear la tarea
   */
  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea', description: 'Crea una nueva tarea en una columna y tablero específicos.' })
  @ApiResponse({ status: 201, description: 'Tarea creada', type: CreateTaskDto })
  @ApiBody({ type: CreateTaskDto })
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  /**
   * Lista tareas con filtros
   * @param query Filtros de búsqueda
   */
  @Get()
  @ApiOperation({ summary: 'Listar tareas con filtros', description: 'Obtiene una lista de tareas permitiendo filtros por parámetros.' })
  @ApiResponse({ status: 200, description: 'Lista de tareas', type: [CreateTaskDto] })
  findAll(@Query() query: ListTasksQueryDto) {
    return this.service.findAll(query);
  }

  /**
   * Obtiene una tarea por ID
   * @param id ID de la tarea
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID', description: 'Obtiene la información de una tarea específica.' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: String })
  @ApiResponse({ status: 200, description: 'Tarea encontrada', type: CreateTaskDto })
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
  @ApiOperation({ summary: 'Actualizar una tarea', description: 'Actualiza los datos de una tarea específica.' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: String })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', type: UpdateTaskDto })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  /**
   * Elimina una tarea
   * @param id ID de la tarea
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea', description: 'Elimina una tarea específica.' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: String })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
