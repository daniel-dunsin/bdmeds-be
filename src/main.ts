import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Version, VersioningType } from '@nestjs/common';
import { ValidationException } from 'src/core/exceptions/validation.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from 'src/core/filters/global.filter';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setGlobalPrefix('api');

    const allowedOrigins = ['http://localhost:3000'];
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    app.disable('x-powered-by');

    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory(errors) {
                return new ValidationException(errors);
            },
        }),
    );

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const swaggerConfig = new DocumentBuilder().setTitle('BDMeds 🏥').setDescription('One or two!').setVersion('1.0.0').build();

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/v1/docs', app, swaggerDoc, { useGlobalPrefix: true });

    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT') || 3000;

    await app.listen(PORT);
}
bootstrap();
