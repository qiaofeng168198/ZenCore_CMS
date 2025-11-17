import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 验证用户
   */
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查账户是否锁定
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('账户已被锁定，请稍后再试');
    }

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      await this.userService.incrementLoginFailed(user.id);
      throw new UnauthorizedException('用户名或密码错误');
    }

    return user;
  }

  /**
   * 登录
   */
  async login(user: User, ip: string) {
    const payload = {
      sub: user.id,
      username: user.username,
      tenantId: user.tenantId,
      userType: user.userType,
    };

    // 更新最后登录信息
    await this.userService.updateLastLogin(user.id, ip);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiration'),
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        userType: user.userType,
        tenantId: user.tenantId,
      },
    };
  }

  /**
   * 刷新Token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOne(payload.sub);

      const newPayload = {
        sub: user.id,
        username: user.username,
        tenantId: user.tenantId,
        userType: user.userType,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
  }
}
