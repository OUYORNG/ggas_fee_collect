import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('School Fee Management API')
    .setDescription('API for managing school fees, students, and payments')
    .setVersion('1.0')
    .addTag('students')
    .addTag('fees')
    .addTag('payments')
    .addTag('discounts')
    .addTag('vouchers')
    .addTag('grades')
    .addTag('programs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api`);
}
bootstrap();
