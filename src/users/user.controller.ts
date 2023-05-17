import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RoleGuard } from "src/auth/role.guard";
import { Roles } from "src/auth/roles.decorator";
import { User } from "src/users/user.schema";
import { UserService } from "src/users/user.service";
import { registerValidationSchema } from '../auth/validation.schema';
import { validate } from 'jsonschema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    async createUser(@Res() res, @Body() user: User) {
        const validationResult =  validate(user, registerValidationSchema);
        if (!validationResult.valid) {
            return res.status(HttpStatus.BAD_REQUEST).json(({success: false, error: validationResult.errors[0].message}))
        }
        
        const isUserExist = await this.userService.findByEmail(user.email)
        if (isUserExist) {
            return res.status(HttpStatus.BAD_REQUEST).json(({success: false, error: "email must be uniqe"}))
        }
        const newUser = await this.userService.create(user);
        delete newUser.password
        return res.status(HttpStatus.CREATED).json({
            newUser
        })
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async fetchAll(@Res() res) {
        const users = await this.userService.readAll();
        return res.status(HttpStatus.OK).json({
            users
        })
    }

    @Roles('Admin', 'User')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('/:id')
    async findById(@Res() res, @Param('id') id) {
        const user = await this.userService.readById(id);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({error: 'user not found'})
        }
        return res.status(HttpStatus.OK).json({
            user
        })
    }

    @Roles('Admin', 'User')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('/:id')
    async update(@Res() res, @Param('id') id, @Body() user: User) {
        // delete email and password because it's not to allow to update them throw this endpoint
        // we can create a new endpoint for reset email and password
        delete user.password
        delete user.email
        
        const updatedUser = await this.userService.update(id, user);
        if (!updatedUser) {
            return res.status(HttpStatus.NOT_FOUND).json({error: 'user not found'})
        }
        return res.status(HttpStatus.OK).json({
            updatedUser
        })
    }

    @Roles('Admin', 'User')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete('/:id')
    async delete(@Res() res, @Param('id') id) {
        const deletedUser = await this.userService.delete(id);
        if (!deletedUser) {
            return res.status(HttpStatus.NOT_FOUND).json({error: 'user not found'})
        }
        return res.status(HttpStatus.OK).json({
            deletedUser
        })
    }
}