import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IncomingMessage } from 'http';
import morgan from 'morgan';

type TPathRequets = IncomingMessage & { path: string };

@Injectable()
export class MorganInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp()

    const req = httpContext.getRequest();
    const res = httpContext.getResponse();

    return new Observable((observer) => {
      morgan('short', {
        skip: (req: TPathRequets) => req.path.includes('health'),
      })(req, res, () => {
        next.handle().subscribe({
          next: (value) => {
            observer.next(value);
          },
          error: (err) => {
            observer.error(err);
          },
          complete: () => {
            observer.complete();
          },
        });
      });
    });
  }
}