import {Context} from "egg";
// import {PermissionRow} from "../model/user";
//{ id: number, name: string, type: string, level: number,path:string, method:string,pid: number }
export default function () {

    return async function permission(ctx: Context, next: () => Promise<any>) {

        console.log('--middleware--', ctx.request);
        await next();

        // const {method, url, header: {Authorization: token}} = ctx.request;
        // const {app: {redis, config: {apiVersion}}} = ctx;
        //
        // if (url.includes('sing-')) return await next();
        //
        // if (token === undefined) return ctx.unauthorized();
        // try {
        //     const decoded = ctx.helper.verifyToken(token);
        //
        //     const {id} = decoded;
        //
        //     if (id === undefined) return ctx.unauthorized();
        //
        //     const apiPermissions = await redis.get(id);
        //
        //     if (!apiPermissions) return ctx.unauthorized();
        //
        //     const permissionList: PermissionRow[] = JSON.parse(apiPermissions);
        //
        //     for (const permission of permissionList) {
        //
        //         let {path, method: permissMethod = ""} = permission;
        //
        //         path = `/${apiVersion}${path.startsWith('/') ? '' : '/'}${path}`;
        //         if ((url && url === path) && (method && method.toLowerCase() === permissMethod.toLowerCase())) return await next();
        //
        //
        //     }
        //
        //     return ctx.forbidden();
        //
        //
        // } catch (e) {
        //
        //     return ctx.unauthorized();
        //
        //
        // }
        //

    }

}