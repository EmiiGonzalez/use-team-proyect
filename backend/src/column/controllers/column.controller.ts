import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam} from '@nestjs/swagger';
import { ColumnService } from '../services/column.service';
import {
  CreateColumnDto,
  UpdateColumnDto,
  ColumnDto
} from '../dtos/column.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ColumnAccessGuard } from 'src/auth/guards/column.access.guard';
import { GetUser } from 'src/auth/decorators/get.user.decorator';
import type { IUserRequest } from 'src/auth/decorators/get.user.decorator';
import { CheckOwner } from 'src/auth/decorators/check.owner.decorator';

@ApiTags('Columns')
@UseGuards(AuthGuard, ColumnAccessGuard)
@Controller('columns')
export class ColumnController {
  constructor(private readonly service: ColumnService) {}

  @Post(':boardId')
  @ApiOperation({ summary: 'Crear columna' })
  @ApiBody({ type: CreateColumnDto })
  @ApiResponse({ status: 201, description: 'Columna creada exitosamente.' })
  create(
    @Param('boardId') boardId: string,
    @Body() dto: CreateColumnDto,
    @GetUser() user: IUserRequest
  ) {
    return this.service.create(boardId, dto, user.id);
  }

  @Get('/all/:boardId')
  @ApiOperation({ summary: 'Listar columnas por board' })
  @ApiParam({
    name: 'boardId',
    type: String,
    description: 'ID del board',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de columnas.',
    type: [ColumnDto]
  })
  findAll(@Param('boardId') boardId: string) {
    return this.service.findAll(boardId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener columna por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la columna' })
  @ApiResponse({ status: 200, description: 'Columna encontrada.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar columna' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la columna' })
  @ApiBody({ type: UpdateColumnDto })
  @ApiResponse({ status: 200, description: 'Columna actualizada.' })
  @CheckOwner()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateColumnDto,
    @GetUser() user: IUserRequest
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar columna' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la columna' })
  @ApiResponse({ status: 200, description: 'Columna eliminada.' })
  @CheckOwner()
  remove(@Param('id') id: string, @GetUser() user: IUserRequest) {
    return this.service.remove(id, user.id);
  }
}
