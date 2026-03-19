import { Body, Controller, Post, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "../../common/interceptor/response.interceptor";
import { TransService } from "./trans.service";
import { OMEHeaderGuard } from "../../common/guard/header.guard";
import { Response } from "express";

// @UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
@Controller("transwebhook")
export class TransController {
    constructor(private readonly transService: TransService) {}

    @UseGuards(OMEHeaderGuard)
    @Post("cast")
    makeCastkey(@Res() res: Response, @Body() body: any) {
        return this.transService.transWebhook(res, body.stream.tracks, body.stream.name);
    }
}
