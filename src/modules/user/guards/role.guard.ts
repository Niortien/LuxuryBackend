import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(), // la méthode qui appelle, le guard, ex: remove
            context.getClass(), // la classe qui appelle, le guard, ex: UserController
        ]);
        if (!requiredRoles) {
            return true;
        }

      
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role?.includes(role.toUpperCase()));
    }
}