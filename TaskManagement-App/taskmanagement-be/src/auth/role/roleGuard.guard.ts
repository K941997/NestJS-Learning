/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserEntity } from "../entity/user.entity";
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        console.log(requiredRoles);

        if (!requiredRoles) {
            return true;
        }

        const {user}: {user: UserEntity} = context.switchToHttp().getRequest();

        // console.log(user); //{ id: 1, role: "admin", ... } phục thuộc JWT Token từ Login AuthService

        console.log(requiredRoles.some((role) => user.role?.includes(role)))

        return requiredRoles.some((role) => user.role?.includes(role));
    }
}