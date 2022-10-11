import {Application} from 'egg';

export default (app: Application) => {
    const {controller, router, config: {apiVersion}} = app;
    const {home, user, role, permission} = controller;
    router.get('/', home.index);

    router.get('/captcha', home.getCaptcha);
    router.get('/mail', home.sendMail);
    router.get('/sms', home.sendSms);

    router.post('/sing-up', home.singUp)
    router.post('/sing-up-email', home.singUpEmail);
    router.post('/sing-up-phone', home.singUpPhone);

    router.get(`${apiVersion}/user`, user.queryUserList);
    router.post(`${apiVersion}/user`, user.createUser);
    router.put(`${apiVersion}/user`, user.updateUser);
    router.delete(`${apiVersion}/user`, user.deleteUser);
    router.put(`${apiVersion}/user-state`, user.updateUserState);
    router.post(`${apiVersion}/user-role`, user.createUserRole);
    router.delete(`${apiVersion}/user-role`, user.delUserRole);

    router.get(`${apiVersion}/role`, role.queryRoleList);
    router.post(`${apiVersion}/role`, role.createRole);
    router.put(`${apiVersion}/role`, role.updateRole);
    router.delete(`${apiVersion}/role`, role.deleteRole);
    router.put(`${apiVersion}/role-state`, role.updateRoleState);
    router.put(`${apiVersion}/role-permiss`, role.updateRolePermission);

    router.get(`${apiVersion}/permission`, permission.queryPermissionList);
    router.post(`${apiVersion}/permission`, permission.createPermission);
    router.put(`${apiVersion}/permission`, permission.updatePermission);
    router.delete(`${apiVersion}/permission`, permission.deletePermission);
    router.put(`${apiVersion}/permission-state`, permission.updatePermissionState);


};
