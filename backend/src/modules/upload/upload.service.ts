import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, StorageType, UseType } from './entities/file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  /**
   * 保存文件记录
   */
  async saveFile(
    file: Express.Multer.File,
    userId: number,
    tenantId?: number,
    useType: UseType = UseType.OTHER,
  ): Promise<File> {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const dateDir = this.getDatePath();
    const targetDir = path.join(uploadDir, dateDir);

    // 确保目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 生成唯一文件名
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(targetDir, filename);
    const fileUrl = `/${dateDir}/${filename}`;

    // 保存文件到磁盘
    fs.writeFileSync(filePath, file.buffer);

    // 保存文件记录到数据库
    const fileEntity = this.fileRepository.create({
      tenantId,
      userId,
      filename,
      originalName: file.originalname,
      filePath,
      fileUrl,
      fileType: ext.replace('.', ''),
      fileSize: file.size,
      mimeType: file.mimetype,
      storageType: StorageType.LOCAL,
      useType,
      isPublic: true,
    });

    return this.fileRepository.save(fileEntity);
  }

  /**
   * 获取日期路径
   */
  private getDatePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  /**
   * 获取文件列表
   */
  async findAll(
    tenantId?: number,
    useType?: UseType,
  ): Promise<File[]> {
    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }
    if (useType) {
      where.useType = useType;
    }

    return this.fileRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  /**
   * 删除文件
   */
  async remove(id: number, userId: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id, userId } });

    if (file) {
      // 删除物理文件
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }

      // 删除数据库记录
      await this.fileRepository.remove(file);
    }
  }
}
