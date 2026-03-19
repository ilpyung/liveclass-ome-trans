import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpRequestService } from "../../http-request/http-request.service";
import { LoggerService } from "src/logger/logger.service";
import { isEmpty, randomString } from "../../utils/util";
import * as crypto from "crypto";

@Injectable()
export class OMEHeaderGuard implements CanActivate {
    constructor() {}
    private readonly secretKey = "dynm!@#";

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const omeSignature = req.headers["x-ome-signature"];
        const calculatedSignature = crypto
            .createHmac("sha1", this.secretKey)
            .update(req.rawBody)
            .digest("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        if (!omeSignature || calculatedSignature !== omeSignature) return false;
        return true;
    }
}
