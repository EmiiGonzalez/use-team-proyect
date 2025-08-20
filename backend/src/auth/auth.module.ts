import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TokenManager } from './util/token.manager';
import { UserController } from './controllers/auth.user.controller';

@Global()
@Module({
  providers: [AuthService, TokenManager],
  controllers: [AuthController, UserController],
  exports: [AuthService, TokenManager] 
})
export class AuthModule {}
 