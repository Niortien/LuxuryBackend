import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { isValid, parse } from "date-fns";

export class InscriptionDto {

    @ApiProperty({ type: String, description: "Email" })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({ type: String, description: "Password" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    password: string;

    @ApiProperty({ type: String, description: "John" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    first_name: string;

    @ApiProperty({ type: String, description: "Doe" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    last_name: string;

    @ApiProperty({ type: Date, description: "Birth Date" })
    @IsOptional()
    @Transform(({ value }) => {
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
            return parsedDate.toISOString();
        }
        return value;
    })
    birth_date?: string;

    @ApiProperty({ type: String, description: "Avatar" })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.trim())
    avatar?: string;
}
