import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class SessionGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context
			.switchToHttp()
			.getRequest<Request & { session?: { user?: unknown } }>();

		if (!request.session?.user) {
			throw new UnauthorizedException("Vous devez être connecté");
		}
		return true;
	}
}