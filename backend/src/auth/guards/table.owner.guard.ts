import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from 'src/shared/constants/key-decorators';
import { CreateBoardMemberDto } from 'src/board-member/dtos/board-member.dtos';
import { PrismaService } from 'src/prisma/service/prisma.service';

/**
 * @description Este guards se encarga de validar los datos del token para permitir acceso
 */
@Injectable()
export class BoardOwnerGuard implements CanActivate {
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
    const { boardId }: CreateBoardMemberDto = request.body; // Asumimos que el ID del board viene en el body (DTO)

    if (!userId || !boardId) {
      throw new UnauthorizedException(
        'No se proporcionó el ID del usuario o del board'
      );
    }

    const isOwner = await this.prisma.board
      .findUnique({
        where: { id: boardId },
        select: { ownerId: true }
      })
      .then((board) => board?.ownerId === userId);

    if (!isOwner) {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a este recurso'
      );
    }

    return true;
  }
}
