import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from 'src/shared/constants/key-decorators';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateColumnDto } from 'src/column/dtos/column.dtos';

/**
 * @description Este guards se encarga de validar los datos del token para permitir acceso
 */
@Injectable()
export class ColumnAccessGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId: string = request['idUser']; // el usuario autenticado está en req.user del guard de autenticación
    let { boardId }: CreateColumnDto = request.body; // Asumimos que el ID del board viene en el body (DTO)
      !boardId && (boardId = request.query.boardId); // o en los query params

    if (!userId || !boardId) {
      throw new UnauthorizedException(
        'No se proporcionó el ID del usuario o del board'
      );
    }

    //busco la board
    const board = await this.prisma.board.findUnique({
      where: { id: boardId }
    });
    if (!board) throw new NotFoundException('Board no encontrada');

    //busco si es miembro
    const isMember = await this.prisma.boardMember.findFirst({
      where: { boardId, userId: userId }
    });

    // si no es miembro ni creador lanzo la excepcion
    if (!isMember && board.ownerId !== userId) {
      throw new UnauthorizedException('Usuario no es miembro del board');
    }

    return true;
  }
}
