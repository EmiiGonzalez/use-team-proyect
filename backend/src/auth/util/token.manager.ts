import * as jwt from 'jsonwebtoken';
import { PayLoadToken } from '../interfaces/auth.interface';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class TokenManager {
  private readonly secret = process.env.JWT_SECRET;
  private readonly expiresIn = process.env.JWT_EXPIRES_IN;
  static instance: TokenManager;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private async singJWT({
    payload
  }: {
    payload: jwt.JwtPayload;
  }): Promise<string> {
    return jwt.sign(payload, this.secret || 'secret', {
      expiresIn: this.expiresIn || '30d'
    });
  }

  /**
   * @description Genera un token JWT y lo retorna
   * @param user
   * @returns Promise<{ accesToken: string }>
   */
  async generateToken(user: User): Promise<{ accesToken: string }> {
    const payload: PayLoadToken = {
      sub: user.id,
      name: user.name
    };
    return {
      accesToken: await this.singJWT({ payload })
    };
  }
}
