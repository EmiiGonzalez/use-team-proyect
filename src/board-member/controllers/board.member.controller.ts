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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
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

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo miembro de board' })
  @ApiResponse({ status: 201, description: 'Miembro creado' })
  @ApiBody({ type: CreateBoardMemberDto })
  create(@Body() dto: CreateBoardMemberDto, @GetUser() user: IUserRequest) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar miembros de board con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de miembros' })
  findAll(@Query() query: ListBoardMembersQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un miembro de board por ID' })
  @ApiParam({ name: 'id', description: 'ID del miembro', type: String })
  @ApiResponse({ status: 200, description: 'Miembro encontrado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el rol de un miembro de board' })
  @ApiParam({ name: 'id', description: 'ID del miembro', type: String })
  @ApiBody({ type: UpdateBoardMemberDto })
  @ApiResponse({ status: 200, description: 'Miembro actualizado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateBoardMemberDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un miembro de board' })
  @ApiParam({ name: 'id', description: 'ID del miembro', type: String })
  @ApiResponse({ status: 200, description: 'Miembro eliminado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
