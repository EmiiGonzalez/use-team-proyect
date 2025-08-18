import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsInt,
  Min
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BoardRoleDto {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

// DTO para crear un miembro
export class CreateBoardMemberDto {
  @ApiProperty({ description: 'ID del board', type: String })
  @IsMongoId()
  boardId: string;

  @ApiProperty({ description: 'ID del usuario', type: String })
  @IsMongoId()
  userId: string;

  @ApiProperty({ enum: BoardRoleDto, default: BoardRoleDto.VIEWER, description: 'Rol del miembro' })
  @IsEnum(BoardRoleDto)
  role: BoardRoleDto = BoardRoleDto.VIEWER;
}

// DTO para actualizar rol de un miembro
export class UpdateBoardMemberDto {
  @ApiPropertyOptional({ enum: BoardRoleDto, description: 'Nuevo rol del miembro' })
  @IsOptional()
  @IsEnum(BoardRoleDto)
  role?: BoardRoleDto;
}

// DTO para listar miembros con filtros
export class ListBoardMembersQueryDto {
  @ApiPropertyOptional({ description: 'ID del board', type: String })
  @IsOptional()
  @IsMongoId()
  boardId?: string;

  @ApiPropertyOptional({ description: 'ID del usuario', type: String })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiPropertyOptional({ enum: BoardRoleDto, description: 'Rol del miembro' })
  @IsOptional()
  @IsEnum(BoardRoleDto)
  role?: BoardRoleDto;

}
