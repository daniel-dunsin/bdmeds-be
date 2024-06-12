import { Catch, HttpException, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface HttpError {
    message: string;
    error: string;
    statusCode: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();

        let error = 'Oops! an error occured';
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            error = (exception.getResponse() as HttpError).message;
            statusCode = exception.getStatus();
        }

        console.log('exception', exception);
        httpAdapter.reply(ctx.getResponse(), { success: false, error, statusCode }, statusCode);
    }
}