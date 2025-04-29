import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


@Injectable()
export class HachageService {

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }

    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

}