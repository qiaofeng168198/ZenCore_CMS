import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建用户
   */
  async create(userData: Partial<User>): Promise<User> {
    // 检查用户名是否已存在
    const existingUsername = await this.userRepository.findOne({
      where: { username: userData.username },
    });

    if (existingUsername) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  /**
   * 根据ID查询用户
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 根据用户名查询用户(包含密码)
   */
  async findByUsername(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  /**
   * 根据邮箱查询用户
   */
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * 更新最后登录信息
   */
  async updateLastLogin(userId: number, ip: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
      loginFailedCount: 0,
    });
  }

  /**
   * 增加登录失败次数
   */
  async incrementLoginFailed(userId: number): Promise<void> {
    await this.userRepository.increment({ id: userId }, 'loginFailedCount', 1);

    // 如果失败次数超过5次，锁定账户1小时
    const user = await this.findOne(userId);
    if (user.loginFailedCount >= 5) {
      const lockedUntil = new Date();
      lockedUntil.setHours(lockedUntil.getHours() + 1);
      await this.userRepository.update(userId, { lockedUntil });
    }
  }

  /**
   * 查询租户下的用户
   */
  async findByTenant(tenantId: number): Promise<User[]> {
    return this.userRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }
}
