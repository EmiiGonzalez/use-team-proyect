import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description: Este decorador se encarga de obtener el usuario autenticado en la petición HTTP.
 * @param {string} data - La propiedad que se desea obtener del usuario.
 * @param {ExecutionContext} ctx - El contexto de ejecución de la petición HTTP.
 * @returns {IUserRequest} El usuario autenticado.
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUserRequest = {
      id: request['idUser'],
      name: request['name']
    };
    return data ? user[data] : user;
  }
);

export interface IUserRequest {
  id: string;
  name: string;
}
