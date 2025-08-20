import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_OWNER, PUBLIC_KEY } from 'src/shared/constants/key-decorators';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { Column } from '@prisma/client';

/**
 * @description Este guards se encarga de validar los accesos a las columnas
 */
@Injectable()
export class TaskAccessGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    );
    const checkOwner = this.reflector.get<boolean>(
      CHECK_OWNER,
      context.getHandler()
    );

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userId: string = request['idUser'];

    //id de la column que se apunta
    let { id } = request.params;
    if (!id) {
      throw new UnauthorizedException('No se proporcionó el ID de la columna');
    }

    const column: Column | null = await this.prisma.column.findUnique({
      where: { id }
    });

    if (!column) {
      throw new NotFoundException('Columna no encontrada');
    }

    if (!userId || !column.boardId) {
      throw new UnauthorizedException(
        `${!userId ? 'No se proporcionó el ID del usuario' : 'El board no existe' }`
      );
    }

    const board = await this.prisma.board.findUnique({
      where: { id: column.boardId, AND: { ownerId: userId } }
    });
    if (!board) throw new NotFoundException('Board no encontrada');

    //busco si es miembro
    const isMember = await this.prisma.boardMember.findFirst({
      where: { boardId: column.boardId, userId: userId }
    });

    // si no es miembro ni creador lanzo la excepcion
    if (!isMember && board.ownerId !== userId) {
      throw new UnauthorizedException('Usuario no es miembro del board');
    }

    if (checkOwner && board.ownerId !== userId) {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a este recurso'
      );
    }

    request.idBoard = column.boardId;
    return true;
  }
}
