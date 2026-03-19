import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from "express";

@ApiExcludeController()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("health")
    health(): string {
        return;
    }

    @Post("rtmp_stop/:channel")
    rtmpStop(@Param("channel") channel: number) {
        return this.appService.rtmpStop(channel);
    }
}
