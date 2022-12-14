import {Application} from 'egg';

export default (app: Application) => {
    const {controller, router, config: {apiVersion}} = app;
    const {home, user, role, permission} = controller;

    router.get('/', home.index);

    router.get('/captcha', home.getCaptcha);
    router.post('/captcha', home.verifyCaptcha);
    router.get('/mail', home.sendMail);
    router.get('/sms', home.sendSms);

    router.post('/sing-up', home.singUp)
    router.post('/sing-up-email', home.singUpEmail);
    router.post('/sing-up-phone', home.singUpPhone);

    router.post('/sing-in', home.singIn);
    router.post('/sing-in-email', home.singInByEmail);
    router.post('/sing-in-phone', home.singInByPhone);

    router.get(`/${apiVersion}/users`, user.queryUserList);
    router.post(`/${apiVersion}/user`, user.createUser);
    router.put(`/${apiVersion}/user`, user.updateUser);
    router.delete(`/${apiVersion}/user`, user.deleteUser);
    router.put(`/${apiVersion}/user-state`, user.updateUserState);
    router.get(`/${apiVersion}/user-permiss`, user.queryUserPermissionList);
    router.post(`/${apiVersion}/user-role`, user.createUserRole);
    router.delete(`/${apiVersion}/user-role`, user.delUserRole);
    router.get(`/${apiVersion}/users-result`,user.exportUsersXlsxFile);
    router.post(`/${apiVersion}/users-result`,user.importUsersFile);

    router.get(`/${apiVersion}/roles`, role.queryRoleList);
    router.post(`/${apiVersion}/role`, role.createRole);
    router.put(`/${apiVersion}/role`, role.updateRole);
    router.delete(`/${apiVersion}/role`, role.deleteRole);
    router.put(`/${apiVersion}/role-state`, role.updateRoleState);
    router.get(`/${apiVersion}/role-permiss`, role.queryRolePermissionList);
    router.put(`/${apiVersion}/role-permiss`, role.updateRolePermission);

    router.get(`/${apiVersion}/permissions`, permission.queryPermissionList);
    router.post(`/${apiVersion}/permission`, permission.createPermission);
    router.put(`/${apiVersion}/permission`, permission.updatePermission);
    router.delete(`/${apiVersion}/permission`, permission.deletePermission);
    router.put(`/${apiVersion}/permission-state`, permission.updatePermissionState);
    router.get(`/${apiVersion}/permission-type`, permission.queryPermissionTypeList);

    router.get(`/${apiVersion}/permissions-all`, permission.queryAllPermissionList);


};
