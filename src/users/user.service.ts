import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/user.schema";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(user: User): Promise<User> {
        const newUser = await this.userModel.create(user)
        return newUser.toJSON();
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        return user?.toJSON()
    }

    async readAll(): Promise<User[]> {
        return await this.userModel.find().select('-password').exec();
    }

    async readById(id): Promise<User> {
        return await this.userModel.findById(id).select('-password').exec();
    }

    async update(id, user: User): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, user, { new: true }).select('-password')
    }

    async delete(id): Promise<any> {
        return await this.userModel.findByIdAndRemove(id).select('-password');
    }
}