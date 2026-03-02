"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
    console.log(`📚 Swagger: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map