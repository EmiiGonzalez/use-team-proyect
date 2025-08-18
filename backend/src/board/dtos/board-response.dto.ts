import { Board } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BoardResponseDto {
  @ApiProperty({
    example: '64e0b7c2f1a2b3c4d5e6f7a8',
    description: 'ID del board'
  })
  id: string;

  @ApiProperty({
    example: 'Tablero de ejemplo',
    description: 'Nombre del board'
  })
  name: string;

  @ApiProperty({
    example: '64e0b7c2f1a2b3c4d5e6f7a1',
    description: 'ID del usuario owner'
  })
  ownerId: string;

  @ApiProperty({
    example: '2025-08-18T12:34:56.789Z',
    description: 'Fecha de creación'
  })
  createdAt: Date;

  constructor(board: Board) {
    this.id = board.id;
    this.name = board.name;
    this.ownerId = board.ownerId;
    this.createdAt = board.createdAt;
  }
}
