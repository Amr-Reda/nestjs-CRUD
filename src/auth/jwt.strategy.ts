import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";
import KEYS from '../config/keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authServe: AuthService) {
        super({
            secretOrKey: KEYS.jwtSecret,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: any): Promise<any> {
        // const user = await this.usersService.getById(payload.sub)
        return {
            _id: payload._id,
            name: payload.name,
            role: payload.role
        };
    }
}