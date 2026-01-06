import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from 'src/common/enum/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('private')
  // @RoleProtected('admin')
  // @UseGuards(AuthGuard(), UserRoleGuard)
  @Auth(ValidRoles.admin)
  privateRoute() {
    return 'This is a private route';
  }
}
