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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import {
  CreateBoardMemberDto,
  UpdateBoardMemberDto,
  ListBoardMembersQueryDto
} from '../dtos/board-member.dtos';
import { BoardMemberService } from '../services/board.member.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get.user.decorators';
import type { IUserRequest } from 'src/auth/decorators/get.user.decorators';
import { BoardOwnerGuard } from 'src/auth/guards/table.owner.guard';

@UseGuards(AuthGuard, BoardOwnerGuard)
@ApiTags('Board Members')
@Controller('board-members')
export class BoardMemberController {
  constructor(private readonly service: BoardMemberService) {}

  /**
   * Crea un nuevo miembro de board
   * @param dto Datos para crear el miembro
   * @param user Usuario autenticado
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo miembro de board',
    description: 'Crea un nuevo miembro en el board especificado.'
  })
  @ApiResponse({
    status: 201,
    description: 'Miembro creado',
    type: CreateBoardMemberDto
  })
  @ApiBody({ type: CreateBoardMemberDto })
  create(@Body() dto: CreateBoardMemberDto, @GetUser() user: IUserRequest) {
    return this.service.create(dto);
  }

  /**
   * Lista miembros de board con filtros
   * @param query Filtros de búsqueda
   */
  @Get()
  @ApiOperation({
    summary: 'Listar miembros de board con filtros',
    description:
      'Obtiene una lista de miembros del board, permitiendo filtros por parámetros.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de miembros',
    type: [CreateBoardMemberDto]
  })
  findAll(@Query() query: ListBoardMembersQueryDto) {
    return this.service.findAll(query);
  }

  /**
   * Obtiene un miembro de board por ID
   * @param id ID del miembro
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un miembro de board por ID',
    description: 'Obtiene la información de un miembro específico del board.'
  })
  @ApiParam({ name: 'id', description: 'ID del miembro', type: String })
  @ApiResponse({
    status: 200,
    description: 'Miembro encontrado',
    type: CreateBoardMemberDto
  })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Actualiza el rol de un miembro de board
   * @param id ID del miembro
   * @param dto Datos de actualización
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar el rol de un miembro de board',
    description: 'Actualiza el rol de un miembro específico del board.'
  })
  @ApiParam({ name: 'id', description: 'ID del miembro', type: String })
  @ApiBody({ type: UpdateBoardMemberDto })
  @ApiResponse({
    status: 200,
    description: 'Miembro actualizado',
    type: UpdateBoardMemberDto
  })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateBoardMemberDto) {
    return this.service.update(id, dto);
  }

  /**
   * Elimina un miembro de board
   * @param id ID del miembro
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un miembro de board',
    description: 'Elimina un miembro específico del board.'
  })
  @ApiParam({ name: 'id', description: 'ID del miembro', type: String })
  @ApiResponse({ status: 200, description: 'Miembro eliminado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
