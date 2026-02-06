import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JoiPipeValidationException } from 'nestjs-joi';

@Injectable()
export class GlobalErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        const request = context.switchToHttp().getRequest();
        const protocol = request.protocol || 'http';
        const hostName = request.get('host') || 'localhost';
        const fullUrl = `${protocol}://${hostName}${request.originalUrl || request.url}`;

        let status: number;
        let message: any;
        let error: string;

        // === Joi validation exception ===
        if (exception instanceof JoiPipeValidationException) {
          status = HttpStatus.BAD_REQUEST;
          message = 'Validation error';
          error = 'ValidationError';

          // Преобразуем детали Joi в массив ошибок с полями
          const details = exception.joiValidationError.details.map(d => {
            return `Поле "${d.path.join('.')}" (${d.type}): ${d.message}`;
          });

          // Объединяем все ошибки в одну строку через перенос строки
          message = details.join(' ');
        }
        // === HttpException ===
        else if (exception instanceof HttpException) {
          status = exception.getStatus();
          const responseBody = exception.getResponse();
          if (typeof responseBody === 'object' && responseBody !== null) {
            message = responseBody['message'] ?? responseBody;
            error = responseBody['error'] ?? 'Error';
          } else {
            message = responseBody;
            error = 'Error';
          }
        }
        // === Любая другая ошибка ===
        else {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = exception instanceof Error ? exception.message : 'Internal server error';
          error = exception.name ?? 'InternalServerError';
        }

        console.error('🔥 Error caught by interceptor:', exception);

        // Возвращаем в едином формате
        return throwError(() =>
          new HttpException(
            {
              statusCode: status,
              message,
              error,
              timestamp: new Date().toISOString(),
              path: fullUrl,
              method: request.method,
            },
            status,
          ),
        );
      }),
    );
  }
}
