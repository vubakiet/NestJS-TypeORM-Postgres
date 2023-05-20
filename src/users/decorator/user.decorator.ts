import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const getUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
