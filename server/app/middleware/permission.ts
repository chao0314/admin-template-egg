import {Context} from "egg";

export default function () {

    return async function permission(ctx: Context, next: () => Promise<any>) {

        console.log('--middleware--', ctx.request);
        const {method, url, header: {Authorization: token}} = ctx.request;
        const {app: {redis}} = ctx;
        if (!url.includes('sing-')) {

            if (token === undefined) return ctx.unauthorized();
            try {
                const decoded = ctx.helper.verifyToken(token);

                const {id} = decoded;

                if (id === undefined) return ctx.unauthorized();

                const apiPermissions = await redis.get(id);

                if (!apiPermissions) return ctx.unauthorized();

                todo....


            } catch (e) {

                return ctx.unauthorized();

            }

        }


        await next();
    }

}