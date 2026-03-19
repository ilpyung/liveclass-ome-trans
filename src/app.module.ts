import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpExceptionFilter } from "./common/filter/exception.filter";
import { LoggerModule } from "./logger/logger.module";
import { APP_FILTER } from "@nestjs/core";
import { HttpRequestModule } from "./http-request/http-request.module";
import { TransModule } from "./modules/trans/trans.module";
import { AdmissionModule } from "./modules/admission/admission.module";
import { RedisModule } from "./redis/redis.module";
import { redisOption } from "./config/redis.option";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env.dev", ".env.prd"],
            isGlobal: false,
        }),
        LoggerModule,
        HttpRequestModule,
        TransModule,
        AdmissionModule,
        RedisModule.forRootAsync(redisOption()),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        /** Exception Filter, Custom변경 가능 */
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {
    /** ## Path Enter Log */
    constructor() {}
}
