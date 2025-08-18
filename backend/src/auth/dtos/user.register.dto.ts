import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;
}
 