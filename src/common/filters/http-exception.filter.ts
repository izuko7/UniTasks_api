import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: unknown = "Erreur interne du serveur";

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const body = exception.getResponse();
            message =
                typeof body === "string"
                    ? body
                    : ((body as { message?: unknown }).message ?? body);
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case "P2025":
                    status = HttpStatus.NOT_FOUND;
                    message = "Ressource introuvable";
                    break;
                case "P2002":
                    status = HttpStatus.CONFLICT;
                    message = "Cette valeur existe déjà";
                    break;
                case "P2003":
                    status = HttpStatus.BAD_REQUEST;
                    message = "Référence invalide";
                    break;
                case "P1001":
                case "P1002":
                case "P1008":
                    status = HttpStatus.SERVICE_UNAVAILABLE;
                    message = "Base de données indisponible";
                    break;
                default:
                    this.logger.error(exception);
            }
        } else if (exception instanceof Prisma.PrismaClientInitializationError) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = "Base de données indisponible";
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = "Requête invalide";
        } else {
            this.logger.error(exception);
        }

        res.status(status).json({
            statusCode: status,
            message,
            path: req.url,
            timestamp: new Date().toISOString(),
        });
    }
}