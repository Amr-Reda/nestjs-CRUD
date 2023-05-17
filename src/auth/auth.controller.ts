import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginValidationSchema, registerValidationSchema } from './validation.schema';
import { validate } from 'jsonschema';
import { UserService } from 'src/users/user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @Post('login')
    async login(@Req() req, @Res() res): Promise<any> {
        const validationResult =  validate(req.body, loginValidationSchema);
        if (!validationResult.valid) {
            return res.status(HttpStatus.BAD_REQUEST).json(({success: false, error: validationResult.errors[0].message}))
        }
        const isUserExist = await this.userService.findByEmail(req.body.email)
        if (!isUserExist) {
            return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Login Failed, please make sure email or password is correct!'})
        }
        const user = await this.authService.login(req.body.email, req.body.password);
        if (!user) {
			return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Login Failed, please make sure email or password is correct!'})
		}

        return res.status(200).json(user)
    }

    @Post('register')
    async register(@Req() req, @Res() res): Promise<any> {
        const validationResult =  validate(req.body, registerValidationSchema);
        if (!validationResult.valid) {
            return res.status(HttpStatus.BAD_REQUEST).json(({success: false, error: validationResult.errors[0].message}))
        }
        
        const isUserExist = await this.userService.findByEmail(req.body.email)
        if (isUserExist) {
            return res.status(HttpStatus.BAD_REQUEST).json(({success: false, error: "email must be uniqe"}))
        }
        const user = await this.authService.register(req.body);
        return res.status(HttpStatus.CREATED).json(user)
    }
}
