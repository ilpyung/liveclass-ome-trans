import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { IsRecord } from "../../../common/decorator/isrecord.decorator";

export class CustomerKeyDto {
    @ApiProperty({ description: "CustomerKey" })
    @IsNumber()
    @IsNotEmpty()
    key: number;
}
