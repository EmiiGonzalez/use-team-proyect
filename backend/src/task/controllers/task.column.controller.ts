import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UpdateTaskPositionInDiferentColumns } from '../dtos/update.task.dto';
import { GetUser } from 'src/auth/decorators/get.user.decorator';
import type { IUserRequest } from 'src/auth/decorators/get.user.decorator';

@UseGuards(AuthGuard)
@ApiTags('Task Column')
@Controller('reorder/tasks/columns')
export class TaskColumnController {
  constructor(private readonly service: TaskService) {}
  
  /**
   * Actualiza una tarea
   * @param dto Datos de actualización
   */
  @Patch('')
  @ApiOperation({
    summary: 'Actualiza el orden de las tareas',
    description: 'Actualiza los datos de tareas en diferentes columnas'
  })
  @ApiBody({ type: UpdateTaskPositionInDiferentColumns })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada'
  })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async updateTasksPositionColumns(
    @Body() dto: UpdateTaskPositionInDiferentColumns,
    @GetUser() user: IUserRequest
  ) {
    return await this.service.updatePositionInOtherColumn(dto, user.id);
  }
}
