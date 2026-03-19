import { Injectable } from "@nestjs/common";
import { HttpRequestService } from "./http-request/http-request.service";

@Injectable()
export class AppService {
    constructor(private readonly httpService: HttpRequestService) {}

    payCheckProcess(body: any) {
        return;
    }

    async rtmpStop(channel: number) {
        await this.rtmpStopSignalSend(channel);
        return;
    }

    private async rtmpStopSignalSend(channel: number) {
        try {
            const url = `http://127.0.0.1:8081/v1/vhosts/default/apps/app/streams/${channel}`;
            const result = await this.httpService.delete(url, {
                headers: {
                    Authorization: `Basic ${Buffer.from("dynm:dynm_ome_teas1").toString("base64")}`,
                },
            });
            return result.data;
        } catch (e) {}
    }
}
