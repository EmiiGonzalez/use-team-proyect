import { ApiProperty } from '@nestjs/swagger';
import {User } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 'usuario@email.com' })
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
