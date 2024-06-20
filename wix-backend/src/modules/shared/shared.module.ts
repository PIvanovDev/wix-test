import { Module } from '@nestjs/common';
import { MorganInterceptor } from './interceptors/morgan.interceptor';

@Module({
  providers: [MorganInterceptor],
  exports: [MorganInterceptor]
})
export class SharedModule {}
