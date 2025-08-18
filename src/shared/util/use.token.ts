import {
  IUseToken,
  PayLoadTokenInterface
} from 'src/auth/interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';

/**
 * @description Esta función recibe un token y retorna un objeto con la información del token decodificado.
 * @param token string
 */
export const useToken = (token: string): IUseToken | string => {
  try {
    const tokenWithoutBearer = token.replace('Bearer ', '');

    const decode = jwt.decode(tokenWithoutBearer) as PayLoadTokenInterface;

    const currentDate = new Date();
    const expirationDate = new Date(decode.exp);

    return {
      sub: decode.sub,
      isExpired: +expirationDate <= +currentDate / 1000,
      name: decode.name
    };
  } catch (e) {
    return 'Invalid token';
  }
};
