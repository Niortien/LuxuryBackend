import { Module } from "@nestjs/common";
import { HachageService } from "./hachage.service";


@Module({
    providers: [HachageService],
    exports: [HachageService]
})
export class HachageModule { }