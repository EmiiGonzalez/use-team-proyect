import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ description: 'Email del usuario' })
  email: string;
  @ApiProperty({ description: 'ID del usuario' })
  id: string;

  constructor(user: User) {
    this.email = user.email;
    this.id = user.id;
  }
}
