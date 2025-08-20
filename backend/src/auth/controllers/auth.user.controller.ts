import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    
    constructor(private readonly authService: AuthService) {}

    @Get(':email')
    async getUserByEmail(@Param('email') email: string) {
        return this.authService.findByEmail(email);
    }
}
