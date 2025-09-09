import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

// const serverUrl = 'http://localhost:3000';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    appSetup(app); //глобальные настройки приложения
    app.enableCors();
    app.set('trust proxy', 'loopback');
    app.use(cookieParser());
    const port = process.env.PORT ?? 3000;

    await app.listen(port);
    // Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
    Logger.log(`🚀 Swagger on: http://localhost:${port}/swagger`);

    // if (process.env.NODE_ENV === 'development') {
    //     // write swagger ui files
    //     get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
    //         response.pipe(
    //             createWriteStream('swagger-static/swagger-ui-bundle.js'),
    //         );
    //     });
    //
    //     get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
    //         response.pipe(
    //             createWriteStream('swagger-static/swagger-ui-init.js'),
    //         );
    //     });
    //
    //     get(
    //         `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
    //         function (response) {
    //             response.pipe(
    //                 createWriteStream(
    //                     'swagger-static/swagger-ui-standalone-preset.js',
    //                 ),
    //             );
    //         },
    //     );
    //
    //     get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
    //         response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    //     });
    // }
}
bootstrap();
