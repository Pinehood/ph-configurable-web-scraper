import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { default as env } from "@/common/env";
import { CommonConstants } from "@/common/enums";

@Injectable()
export class KeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const sk = request.get(CommonConstants.REQUEST_HEADER);
    if (env().SECRET_KEYS.includes(sk)) {
      return true;
    } else {
      return false;
    }
  }
}
