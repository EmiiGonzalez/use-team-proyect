import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { configModule } from './config/config';
import { BoardModule } from './board/board.module';

@Module({
  imports: [configModule, PrismaModule, AuthModule, BoardModule],
  controllers: [],
  providers: []
})
export class AppModule {}
