import { Injectable } from "@nestjs/common";
import { RedisConnection } from "../../redis/redis.utils";
import { RedisModel } from "../../redis/redis.model";

@Injectable()
export class AdmissionRedis {
    CHANNEL_ROOMS = (room: string) => `@cn-rminfo-${room}`;
    connection: RedisConnection = null;

    constructor(private readonly redisModel: RedisModel) {
        this.connection = redisModel.connection;
    }
}
