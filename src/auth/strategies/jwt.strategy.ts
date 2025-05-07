import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants/JWTConstants";
import { UserService } from "src/modules/user/services/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {

    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }
    async validate(payload: {
        id: string;
        email: string;
    }) {

        const user = await this.userService.findOne(payload.id);

        const { password, updatedAt, ...rest } = user;

        return rest;
    }
}

// Nom de la stratégie par défaut c'est jwt