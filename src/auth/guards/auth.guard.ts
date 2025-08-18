import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { PUBLIC_KEY } from 'src/shared/constants/key-decorators';
import { IUseToken } from '../interfaces/auth.interface';
import { useToken } from 'src/shared/util/use.token';


/**
 * @description Clase que implementa la interfaz CanActivate de NestJS para proteger las rutas de la aplicación con un token de autenticación.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    // Si la metadata es verdadera, no se necesita un token de autenticación.
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token expirado');
    }

    const { sub } = manageToken;
    const user = await this.authService.findOneByIdForAuth(sub);

    
    req.idUser = user.id;
    
    return true;
  }
}
