import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = Symbol('IsPublicRoute');
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
