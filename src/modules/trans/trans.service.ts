import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { createDir, deepClone, getDirs, getTime, isExsist, randomString } from "../../utils/util";
import { spawn, exec } from "child_process";
import { create } from "domain";
import { HttpRequestService } from "../../http-request/http-request.service";
import { Response } from "express";
import { WebhookAdminModule } from "./module/webhook-admin";
import { AdmissionRedis } from "../admission/admission.redis";
import { AdmissionService } from "../admission/admission.service";

@Injectable()
export class TransService {
    recordPath = null;
    clipPath = null;
    ffmpegExec = {};

    constructor(
        private readonly httpService: HttpRequestService,
        private readonly webhookAdminModule: WebhookAdminModule,
        private readonly admissionService: AdmissionService,
    ) {}

    async transWebhook(res: Response, body: any[], streamName: string) {
        console.log(`----${streamName}----`)
        console.log(body);
        console.log(`------------`)
        res.setHeader("Content-Type", "application/json");
        let videoBitrate = 0,
            videoFrame = 0,
            videoHeight = 0,
            videoWidth = 0,
            videoCodec = null;
        let audioBitrate = 0,
            audioChannel = 0,
            audioSample = 0;
        body.forEach(dt => {
            if (dt.type == "Video") {
                videoBitrate = dt.video.bitrate;
                videoFrame = dt.video.framerate;
                videoHeight = dt.video.height;
                videoWidth = dt.video.width;
                videoCodec = dt.video.codec;
            }
            if (dt.type == "Audio") {
                audioBitrate = dt.audio.bitrate;
                audioChannel = dt.audio.channel;
                audioSample = dt.audio.samplerate;
            }
        });
        const videoProfile = { bitrate: videoBitrate, width: videoWidth, height: videoHeight, frame: videoFrame };
        const audioProfile = { bitrate: audioBitrate, channel: audioChannel, sample: audioSample };
        const result = {
            allowed: true,
            outputProfiles: {
                outputProfile: [this.webhookAdminModule.createProfile(videoProfile, audioProfile)],
            },
        };
        return res.status(200).send(result);
    }
}
