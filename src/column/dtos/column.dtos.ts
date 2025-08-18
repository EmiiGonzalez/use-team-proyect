import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class CreateColumnDto {
  @IsMongoId({ message: 'El boardId debe ser un MongoId válido.' })
  boardId: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name: string;

  @IsInt({ message: 'La posición debe ser un número entero.' })
  @Min(0, { message: 'La posición debe ser mayor o igual a 0.' })
  position: number;
}

export class UpdateColumnDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name?: string;
}

export class ListColumnsQueryDto {
  @IsMongoId({ message: 'El boardId debe ser un MongoId válido.' })
  boardId: string;
}

export class ListUpdatePositionDto {
  @IsMongoId({ message: 'El columnId debe ser un MongoId válido.' })
  columnId: string;

  @IsInt({ message: 'La posición debe ser un número entero.' })
  @Min(0, { message: 'La posición debe ser mayor o igual a 0.' })
  position: number;
}
