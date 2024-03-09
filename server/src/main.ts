import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonResultInterceptor } from '@/common/common-result.interceptor';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Custom Exception Filter
  app.useGlobalFilters(new AllExceptionFilter());
  // Pack CommonResult
  app.useGlobalInterceptors(new CommonResultInterceptor());
  // Use class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new HttpException(
          Object.values(errors[0].constraints)[0],
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  // Swagger Config
  // Swagger UI: http://localhost:3000/api-docs
  // JSON Doc: http://localhost:3000/api-docs-json
  const swaggerConfig = new DocumentBuilder()
    .setTitle('OpenChat')
    .setDescription('OpenChat API Docs')
    .setVersion('0.0.1')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
