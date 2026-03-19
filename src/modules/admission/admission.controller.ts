import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Query,
    Res,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { TransformInterceptor } from "../../common/interceptor/response.interceptor";
import { OMEHeaderGuard } from "../../common/guard/header.guard";
import { Response } from "express";
import { AdmissionService } from "./admission.service";

// @UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
@Controller("admission")
export class AdmissionController {
    constructor(private readonly admissionService: AdmissionService) {}

    @Post()
    @HttpCode(200) // 여기서 200으로 고정합니다.
    admission(@Body() body: any) {
        return this.admissionService.admission(body.request);
    }

    @Get("check/live")
    async checkLive(@Query("roomId") roomId: string) {
        const streams = await this.admissionService.getStreamInOME(roomId);
        return streams
    }
}