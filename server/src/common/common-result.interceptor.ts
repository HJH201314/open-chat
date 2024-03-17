import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResult } from '@/entity/Result';

/**
 * Pack controller result to uniform common result
 */
@Injectable()
export class CommonResultInterceptor implements NestInterceptor {
  static defaultCommonResultKeys = Object.keys(new CommonResult(null));

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        // return original value if it is already common result
        const keys = Object.keys(data);
        if (
          keys.length ==
            CommonResultInterceptor.defaultCommonResultKeys.length &&
          keys.every(
            (v, i) => v === CommonResultInterceptor.defaultCommonResultKeys[i],
          )
        )
          return data;
        // pack data to common result
        return CommonResult.success(data);
      }),
    );
  }
}
