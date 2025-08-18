import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({ example: 'Mi nuevo tablero', description: 'Nombre del board' })
  @IsString({ message: 'El nombre del board debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del board es obligatorio' })
  name: string;
}
