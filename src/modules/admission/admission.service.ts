import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { HttpRequestService } from "../../http-request/http-request.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdmissionService {
    recordPath = null;
    clipPath = null;
    ffmpegExec = {};

    constructor(
        private readonly httpService: HttpRequestService,
        private readonly configService: ConfigService,
    ) { }

    async admission(request: any) {
        const { status, url, time, new_url } = request;
        const splitName = url.split("/");
        const streamName = splitName[splitName.length - 1];
        const roomId = await this.getTokenInfo(streamName);
        const returnObj = {
            allowed: true,
        };
        if (status == "closing") {
            this.setCastLog(roomId, "end", request.ip);
            return returnObj;
        }
        returnObj["new_url"] = `rtmp://127.0.0.1:1935/app/${roomId}`;
        if (new_url == null) {
            this.setCastLog(roomId, "start", request.ip);
        }
        return returnObj;
    }

    private async getTokenInfo(userKey: string) {
        const url = `http://127.0.0.1:8000/api/token/${userKey}`;
        const tokenInfo = await this.httpService.get(url, { headers: { "Authorization": `ome-trans` } });
        if (!tokenInfo) {
            throw new NotFoundException("Token not found");
        }
        return tokenInfo.data?.roomId;
    }

    private async setCastLog(roomId: string, status: "start" | "end", ip: string) {
        const url = `http://127.0.0.1:8000/api/castlog`;
        await this.httpService.post(url, { data: { roomId, status, ip } });
    }


    async getStreamInOME(roomId:string) {
        const url = `http://127.0.0.1:8081/v1/vhosts/default/apps/app/streams/${roomId}`;
        try{
            const result = await this.httpService.get(url, {
                headers: {
                    Authorization: `Basic ${Buffer.from("dynm:dynm_ome_teas1").toString("base64")}`,
                },
            });
            if (result.data == null || result.data.statusCode != 200 || result?.data?.message != "OK") {
                return { casting : false}
            }
            return { casting : true };
        }catch(e){
            return { casting : false }  
        }
    }
}
