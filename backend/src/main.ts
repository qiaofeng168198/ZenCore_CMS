import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 安全中间件
  app.use(helmet());

  // 启用CORS
  const corsOrigin = configService.get<string[]>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API前缀
  const apiPrefix = configService.get<string>('app.apiPrefix');
  app.setGlobalPrefix(apiPrefix);

  // Swagger文档
  if (configService.get('app.nodeEnv') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ZenCore CMS API')
      .setDescription('ZenCore CMS API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', '认证模块')
      .addTag('users', '用户模块')
      .addTag('tenants', '租户模块')
      .addTag('contents', '内容模块')
      .addTag('templates', '模板模块')
      .addTag('agents', '代理商模块')
      .addTag('subscriptions', '订阅模块')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('app.port');
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
