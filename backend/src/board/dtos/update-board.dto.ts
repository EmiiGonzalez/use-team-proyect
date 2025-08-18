import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoardDto {
  @ApiPropertyOptional({ example: 'Tablero actualizado', description: 'Nombre del board' })
  @IsString()
  @IsOptional()
  name?: string;
}
