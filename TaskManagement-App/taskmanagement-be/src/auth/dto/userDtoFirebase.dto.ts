/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from "class-validator";

export class UserDtoFirebase {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: string;
}