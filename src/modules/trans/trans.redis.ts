import { Injectable } from "@nestjs/common";
import { RedisConnection } from "../../redis/redis.utils";
import { RedisModel } from "../../redis/redis.model";

@Injectable()
export class TransRedis {
    connection: RedisConnection = null;
    TRANS_STREAMS = "trans:streams";

    constructor(private readonly redisModel: RedisModel) {
        this.connection = redisModel.connection;
    }

    addStream(stream: string) {
        this.connection.rpush(this.TRANS_STREAMS, stream);
    }

    delStream(stream: string) {
        this.connection.lrem(this.TRANS_STREAMS, 0, stream);
    }

    getStreams() {
        return this.connection.lrange(this.TRANS_STREAMS, 0, -1);
    }
}
