/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from "@nestjs/common";

//!Middleware:
@Injectable()
export class AuditMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        console.log("Logging DELETE request Headers ", req.headers);
        next()
    }
}