import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { compare } from 'bcryptjs';
import { User, UserDocument } from "src/users/user.schema";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {
        
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);

        if (user && await compare(password, user.password)) {
            const { password, email, ...rest} = user;
            return rest;
        }

        return null
    }

    async login(email: string, password: string): Promise<any> {
        const result = await this.validateUser(email, password)
        if (!result) {
            return null
        }

        const payload = {...result}
        
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async register(body: any): Promise<any> {
        let user = await this.userService.create(body)
        delete user.password
        return {
            user
        }
    }
}
