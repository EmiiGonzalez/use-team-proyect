import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description: Este decorador se encarga de obtener el ID del tablero en la petición HTTP.
 * @param {string} data - La propiedad que se desea obtener del tablero.
 * @param {ExecutionContext} ctx - El contexto de ejecución de la petición HTTP.
 */
export const GetIdBoard = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const idBoard = request['idBoard'];
    return data ? idBoard[data] : idBoard;
  }
);

export interface IBoardRequest {
  idBoard: string;
}
