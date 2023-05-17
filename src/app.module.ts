import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './users/user.controller';
import { User, UserSchema } from './users/user.schema';
import { UserService } from './users/user.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import KEYS from './config/keys';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(KEYS.mongoURI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, AuthService, JwtService],
})
export class AppModule { }