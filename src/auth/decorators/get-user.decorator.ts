import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new InternalServerErrorException('User not found (request)')
    if (data && !(data in user)) throw new InternalServerErrorException(`Property "${data}" does not exist in the user data (request)`);

    return data ? user[data] : user;
})