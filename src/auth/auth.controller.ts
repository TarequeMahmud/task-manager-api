import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentiaslDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthCredentiaslDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthCredentiaslDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }
}
