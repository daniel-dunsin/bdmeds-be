import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const IsPublic = Reflector.createDecorator();

export const Auth = createParamDecorator((props: any, ctx: ExecutionContext) => {
   const req = ctx.switchToHttp().getRequest<Request>();

   return props ? req['user'][props] : req['user'];
});
