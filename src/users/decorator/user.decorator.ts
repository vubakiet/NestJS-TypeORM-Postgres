import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface User {
    userId: number;
    username: string;
}

export const getUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        console.log(request);
        const user = request.user as User;

        return user?.userId;
    },
);
