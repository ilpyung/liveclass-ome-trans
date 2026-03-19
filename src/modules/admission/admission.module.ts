import { Module } from "@nestjs/common";
import { HttpRequestModule } from "../../http-request/http-request.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { AdmissionController } from "./admission.controller";
import { AdmissionService } from "./admission.service";
import { AdmissionRedis } from "./admission.redis";

@Module({
    controllers: [AdmissionController],
    imports: [HttpRequestModule, ScheduleModule.forRoot()],
    providers: [AdmissionService, AdmissionRedis],
    exports: [AdmissionService, AdmissionRedis],
})
export class AdmissionModule {}
