import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks(); // 중요
    app.use(
        express.json({
            verify: (req, res, buf, encoding) => {
                // JSON 파싱 전에 이 함수를 통해 raw body를 저장
                req["rawBody"] = buf; // buf는 Buffer 타입
            },
        }),
    );
    await app.listen(2020);
}

process.on("uncaughtException", err => {
    console.log(err);
});
bootstrap();
