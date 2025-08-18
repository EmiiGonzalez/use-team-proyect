import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { BoardResponseDto } from '../dtos/board-response.dto';
import { UpdateBoardDto } from '../dtos/update-board.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get.user.decorators';
import type { IUserRequest } from 'src/auth/decorators/get.user.decorators';

@ApiTags('Boards')
@UseGuards(AuthGuard)
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo board' })
  @ApiResponse({ status: 201, type: BoardResponseDto })
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: IUserRequest
  ): Promise<BoardResponseDto> {
    return this.boardService.create(createBoardDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un board por ID' })
  @ApiResponse({ status: 200, type: BoardResponseDto })
  async findOne(@Param('id') id: string): Promise<BoardResponseDto> {
    return this.boardService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un board' })
  @ApiResponse({ status: 200, type: BoardResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @GetUser() user: IUserRequest
  ): Promise<BoardResponseDto> {
    return this.boardService.update(id, updateBoardDto, user);
  }
}
