import { Injectable } from "@nestjs/common";
import { deepClone } from "../../../utils/util";

@Injectable()
export class WebhookAdminModule {
    BASE_BITRATE = 6500000;
    constructor() {}

    createProfile(
        video: { bitrate: number; width: number; height: number; frame: number },
        audio: { bitrate: number; channel: number; sample: number },
    ) {
        if (video.bitrate > this.BASE_BITRATE) throw new Error("Video bitrate exceeds the maximum limit");
        const videoRendition = this.createVideoRendition(video.width, video.height);
        // let videoRenditionForHLS = deepClone(videoRendition);
        // videoRenditionForHLS = videoRenditionForHLS.map(res => {
        //     res.audio = "aac_audio";
        //     return res;
        // });
        const result = {
            name: "LiveStream",
            outputStreamName: "${OriginStreamName}",
            playlists: [
                {
                    name: "live-stream",
                    fileName: "live",
                    options: {
                        webRtcAutoAbr: true,
                    },
                    renditions: videoRendition,
                },
            ],
            encodes: {
                videos: this.createVideoEncodes(video.width, video.height, video.frame, videoRendition),
                audios: this.createAudioEncodes(audio.bitrate, audio.channel, audio.sample),
            },
        };

        return result;
    }

    private createVideoRendition(width: number, height: number) {
        // const basePosition = width < height ? width : height;
        const returnRendition = [
            {
                name: `origin`,
                video: `origin`,
                audio: "opus_audio",
            },
        ];
        return returnRendition;
    }

    private createVideoEncodes(width: number, height: number, frame: number, renditions: any[]) {
        const landscape = width > height;
        const videos = [];
        renditions.forEach(res => {
            if (res.video == "origin") {
                videos.push({
                    name: res.video,
                    bypass: true,
                });
                return;
            }
            // const videoSize = Number(res.video.replace("p", ""));
            // videos.push({
            //     name: res.video,
            //     codec: "h264",
            //     bitrate: this.BASE_BITRATE,
            //     framerate: frame,
            //     ...(landscape ? { height: videoSize } : { width: videoSize }),
            //     preset: "fast",
            //     bypassIfMatch: {
            //         ...(landscape ? { height: "lte" } : { width: "lte" }),
            //     },
            // });
        });
        return videos;
    }

    private createAudioEncodes(bitrate: number, channel: number, sample: number) {
        return [
            {
                name: "opus_audio",
                codec: "opus",
                bitrate,
                samplerate: sample,
                channel,
                bypassIfMatch: {
                    codec: "eq",
                },
            },
            {
                name: "aac_audio",
                codec: "aac",
                bitrate,
                samplerate: sample,
                channel,
                bypassIfMatch: {
                    codec: "eq",
                },
            },
        ];
    }
}
