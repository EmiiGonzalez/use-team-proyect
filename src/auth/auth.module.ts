import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TokenManager } from './util/token.manager';

@Global()
@Module({
  providers: [AuthService, TokenManager],
  controllers: [AuthController],
  exports: [AuthService, TokenManager] 
})
export class AuthModule {}
 