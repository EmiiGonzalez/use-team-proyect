import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserLoginDto } from '../dtos/user.login.dto';
import { TokenDto } from '../dtos/token.response.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: UserRegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado',
    type: TokenDto
  })
  async register(@Body() body: UserRegisterDto): Promise<TokenDto> {
    return await this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 201, description: 'Login exitoso', type: TokenDto })
  async login(@Body() body: UserLoginDto): Promise<TokenDto> {
    return this.authService.login(body.email, body.password);
  }

  @Get('email')
  @ApiOperation({ summary: 'Obtener usuario por email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserResponseDto
  })
  async getByEmail(@Query('email') email: string): Promise<UserResponseDto> {
    return this.authService.findByEmail(email);
  }
}
