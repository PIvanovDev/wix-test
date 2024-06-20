import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { get, set } from 'lodash';

export class FormatListArgsInterceptor implements NestInterceptor {
  constructor(private transforms: string[]) {}

  transform(value: any) {
    return Object.assign(
      value,
      this.transforms.reduce(
        (acc, item) =>
          set(
            acc,
            item,
            get(value, item)
              ? get(value, item, '')
                  .split(',')
                  .filter((v) => v)
              : undefined,
          ),
        value,
      ),
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.transform(request);

    return next.handle();
  }
}
