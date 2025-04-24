import { IsString, IsInt, IsOptional } from 'class-validator';
import { Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class CreateWatchDto {

    @ApiProperty({
        type: "string",
        example: "Rolex",
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    name: string;

    @ApiProperty({
        type: "string",
        example: "A beautiful watch"
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    description: string;

    @ApiProperty({
        type: "number",
        example: 1000
    })
    @IsInt()
    price: number

    @ApiProperty({
        type: "string",
        example: "path/to/watch.jpg",
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    pathi?: string
}
