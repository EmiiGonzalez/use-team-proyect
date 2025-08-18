import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { TokenDto } from '../dtos/token.response.dto';
import * as bcrypt from 'bcrypt';
import { TokenManager } from '../util/token.manager';
import { User } from '@prisma/client';
import { UserResponseDto } from '../dtos/user.response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(userRegisterDto: UserRegisterDto): Promise<TokenDto> {
    const exists = await this.exists(userRegisterDto.email);
    if (exists) {
      throw new BadRequestException('Ya existe un usuario con este email');
    }
    const hashedPassword = await bcrypt.hash(userRegisterDto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        name: userRegisterDto.name,
        email: userRegisterDto.email,
        password: hashedPassword
      }
    });
    const tokenManager = TokenManager.getInstance();
    const tokenObj = await tokenManager.generateToken(user as User);
    return { accessToken: tokenObj.accesToken };
  }

  async login(email: string, password: string): Promise<TokenDto> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const tokenManager = TokenManager.getInstance();
    const tokenObj = await tokenManager.generateToken(user as User);
    return { accessToken: tokenObj.accesToken };
  }

  private async exists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });
    return !!user;
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: {
          contains: email,
          mode: 'insensitive'
        }
      }
    });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return new UserResponseDto(user);
  }

  async findOneByIdForAuth(id: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return new UserResponseDto(user);
  }
}
