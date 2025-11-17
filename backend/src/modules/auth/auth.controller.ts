import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    const ip = req.ip || req.connection.remoteAddress;
    return this.authService.login(user, ip);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      userType: registerDto.userType,
      tenantId: registerDto.tenantId,
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      message: '注册成功',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新Token' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
