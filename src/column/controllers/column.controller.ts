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
import { ColumnService } from '../services/column.service';
import {
  CreateColumnDto,
  UpdateColumnDto,
  ListColumnsQueryDto
} from '../dtos/column.dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ColumnAccessGuard } from 'src/auth/guards/column.access.guard';
import { GetUser } from 'src/auth/decorators/get.user.decorators';
import type { IUserRequest } from 'src/auth/decorators/get.user.decorators';

@UseGuards(AuthGuard, ColumnAccessGuard)
@Controller('columns')
export class ColumnController {
  constructor(private readonly service: ColumnService) {}

  @Post()
  create(@Body() dto: CreateColumnDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: ListColumnsQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateColumnDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: IUserRequest) {
    return this.service.remove(id, user);
  }
}
