// import { ConfigService } from "@nestjs/config";
// import { TransRedis } from "./trans.redis";

// export class TransScheduler {
//     TOTAL_GROUPS = 10;
//     secondCounter = 0;
//     currentStream = new Map<number, string[]>();
//     streamMap = new Map<string, number>();

//     VOD_RECORD_PATH = null;
//     private constructor(private readonly transRedis: TransRedis, private readonly configService: ConfigService) {
//         this.VOD_RECORD_PATH = this.configService.get<string>("VOD_RECORD_PATH");
//     }

//     private async getStreamListFromRedis() {}
//     private async getStreamListFromOME() {}

//     async pushStream(stream: string) {
//         let minLength = Infinity;
//         let targetIndex = -1;

//         for (let i = 0; i < this.TOTAL_GROUPS; i++) {
//             const group = this.currentStream.get(i);
//             if (!group) {
//                 this.currentStream.set(i, [stream]);
//                 this.streamMap.set(stream, i);
//                 return;
//             }
//             if (group.length < minLength) {
//                 minLength = group.length;
//                 targetIndex = i;
//             }
//         }
//         if (targetIndex !== -1) {
//             this.currentStream.get(targetIndex).push(stream);
//             this.streamMap.set(stream, targetIndex);
//         }
//     }

//     async deleteStream(stream: string) {
//         const groupIndex = this.streamMap.get(stream);
//         if (groupIndex === null) return;
//         const group = this.currentStream.get(groupIndex);
//         if (group) {
//             this.currentStream.set(
//                 groupIndex,
//                 group.filter(s => s !== stream),
//             );
//         }
//         this.streamMap.delete(stream);
//     }

//     async schedulerThumbnailCreator() {
//         setInterval(() => {
//             if (this.secondCounter == 10) this.secondCounter = 0;
//             const currentBucket = this.secondCounter % this.TOTAL_GROUPS;
//             const streams = this.currentStream.get(currentBucket) || [];
//             console.log(
//                 `[${new Date().toLocaleTimeString()}] Group ${currentBucket} 처리 중... (개수: ${streams.length})`,
//             );

//             // 4. 추출된 15개 스트림에 대해 FFmpeg 실행
//             streams.forEach(streamId => {
//                 this.generateThumbnail(streamId);
//             });

//             this.secondCounter++;
//         }, 1000); // 1초마다 실행
//     }

//     async generateThumbnail(streamId: string) {}
// }
