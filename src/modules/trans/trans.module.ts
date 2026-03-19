import { Module } from "@nestjs/common";
import { TransService } from "./trans.service";
import { HttpRequestModule } from "../../http-request/http-request.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { TransController } from "./trans.controller";
import { WebhookAdminModule } from "./module/webhook-admin";
import { AdmissionService } from "../admission/admission.service";
import { AdmissionModule } from "../admission/admission.module";

@Module({
    controllers: [TransController],
    imports: [HttpRequestModule, ScheduleModule.forRoot(), AdmissionModule],
    providers: [TransService, WebhookAdminModule],
})
export class TransModule {}
