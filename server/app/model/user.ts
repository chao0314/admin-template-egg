import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";

// import {Rows} from "../../lib/plugin/egg-mysql2/typings";
export type UserInfo = { username?: string, email?: string, phone?: string, password?: string };
export type FilterInfo = Partial<{
    role: number, origin: string, state: string | number, keyword: string,
    username: string, email: string, phone: string, pageSize: number, page: number
}>;
export type UserRow = { id: string, username: string, email: string, phone: string, state: number, roles: { roleId: number, roleName }[] };
export type PermissionRow = { id: number, name: string, type: string, level: number, path: string, method: string, pid: number };
export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;

    // const queryFoundRows = `SELECT FOUND_ROWS() AS total;`;
    const queryUserCount = `SELECT count(*) as total  FROM users;`;
    const queryByNameSql = `SELECT id,username FROM users WHERE username = ?;`;
    const queryByPhoneSql = `SELECT id,phone FROM template_db.users WHERE phone = ?;`;
    const queryByEmailSql = `SELECT id,email FROM template_db.users WHERE email = ?;`;
    const queryByNameAndPassSql = `SELECT id,username FROM template_db.users WHERE username= ? AND password= ?;`;
    const queryByEmailAndPassSql = `SELECT id,username FROM template_db.users WHERE email= ? AND password= ?;`;
    const queryByPhoneAndPassSql = `SELECT id,username FROM template_db.users WHERE phone= ? AND password= ?;`;
    const delByIdSql = `DELETE FROM users WHERE id = ?;`;
    // const updateByIdSql = `UPDATE users SET username= ?,email= ?,phone= ?,password= ? WHERE id= ?;`;
    const updateUserStateByIdSql = `UPDATE users SET user_state = ? WHERE id= ?;`;
    const createUserRoleSql = `INSERT INTO users_roles (user_id,role_id) VALUES (?,?);`;
    const delUserRoleSql = `DELETE FROM users_roles WHERE user_id = ? AND role_id = ?;`;
    const queryUserRoleListSql = `SELECT  JSON_ARRAYAGG(JSON_OBJECT('roleId',
                                                    r.id,
                                                    'name',
                                                    r.role_name,
                                                    'des',
                                                    r.role_des)) AS roles
                                FROM users_roles AS ur LEFT JOIN  roles AS r ON ur.role_id = r.id
                                WHERE ur.user_id = ? GROUP BY ur.user_id;`

    const queryUserPermissionListSql = `SELECT 
                                        p.id,
                                        p.permiss_name as name,
                                        p.permiss_type as type,
                                        p.permiss_level as level,
                                        p.permiss_path as path,
                                        p.permiss_method as method,
                                        p.permiss_pid as pid
                                    FROM
                                        users AS u
                                            LEFT JOIN
                                        users_roles AS ur ON u.id = ur.user_id
                                            LEFT JOIN
                                        roles AS r ON ur.role_id = r.id
                                            LEFT JOIN
                                        roles_permissions AS rp ON ur.role_id = rp.role_id
                                            LEFT JOIN
                                        permissions AS p ON rp.permiss_id = p.id
                                    WHERE
                                        u.id = ? AND r.role_state = 1
                                            AND p.permiss_state = 1
                                    GROUP BY p.id;`

    return {

        async createUser(row: Record<string, any>) {

            const execution = helper.genCreateExecution('users', row);

            return pool.execute(...execution);

        },
        async queryByName(username: string) {

            return pool.execute<Rows<{ id: number, username: string }>>(queryByNameSql, [username]);

        },

        async queryByPhone(phone: string) {

            return pool.execute<Rows<{ id: number, phone: string }>>(queryByPhoneSql, [phone]);

        },

        async createByPhone(row: { phone: string, password: string }) {

            const execution = helper.genCreateExecution('users', row);
            return pool.execute(...execution);
        },

        async queryByEmail(email: string) {

            return pool.execute<Rows<{ id: number, email: string }>>(queryByEmailSql, [email]);
        },

        async createByEmail(row: { email: string, password: string }) {

            const execution = helper.genCreateExecution('users', row);
            return pool.execute(...execution);
        },

        async queryByNameAndPass({username, password}: { username: string, password: string }) {

            return pool.execute<Rows<{ id: number, username: string }>>(queryByNameAndPassSql, [username, password]);
        },

        async queryByEmailAndPass({email, password}: { email: string, password: string }) {

            return pool.execute<Rows<{ id: number, email: string }>>(queryByEmailAndPassSql, [email, password]);

        },
        async queryByPhoneAndPass({phone, password}: { phone: string, password: string }) {

            return pool.execute<Rows<{ id: number, phone: string }>>(queryByPhoneAndPassSql, [phone, password]);
        },

        async delUserById(id: string | number) {

            return pool.execute(delByIdSql, [id]);

        },

        async updateUserById(payload: UserInfo & { id: number }) {

            const execution = ctx.helper.genUpdateExecution('users', payload);

            return pool.execute(...execution);
        },

        async updateUserState(payload: { id: number, state: 0 | 1 }) {
            const {id, state} = payload;

            return pool.execute(updateUserStateByIdSql, [state, id]);

        },

        async queryUserList(filter: FilterInfo) {

            // const sql2 =`SELECT SQL_CALC_FOUND_ROWS
            //          u.id,
            //          u.username,
            //          u.email,
            //          u.phone,
            //          u.user_state AS state,
            //          JSON_ARRAYAGG(JSON_OBJECT('roleId', r.id, 'roleName', r.role_name)) AS roles
            //      FROM
            //          users AS u
            //              LEFT JOIN
            //          users_roles AS ur ON u.id = ur.user_id
            //              LEFT JOIN
            //          roles AS r ON ur.role_id = r.id
            //      WHERE
            //          u.user_state = 1 AND u.origin = 'github'
            //              AND (u.username LIKE '%zhi%'
            //              OR u.email LIKE '%zhi%'
            //              OR u.phone LIKE '%zhi%')
            //      GROUP BY u.id
            //      HAVING JSON_CONTAINS(roles, JSON_OBJECT('roleId', 2))
            //      ORDER BY u.id DESC
            //      LIMIT 10 OFFSET 0;`


            const {role, origin, state, username, email, phone, page = 1, pageSize = 10} = filter;
            const andFragments: string[] = [];
            const orFragments: string[] = [];
            const values: (number | string)[] = [];
            if (state !== undefined) {
                andFragments.push(` u.user_state = ? `);
                values.push(state);
            }
            if (origin !== undefined) {
                andFragments.push(` u.origin = ? `);
                values.push(origin);
            }
            if (username !== undefined) {
                orFragments.push(` u.username LIKE ? `);
                values.push(`%${username}%`);
            }
            if (email !== undefined) {
                orFragments.push(` u.email LIKE ? `);
                values.push(`%${email}%`);
            }
            if (phone !== undefined) {
                orFragments.push(` u.phone LIKE ? `);
                values.push(`%${phone}%`);
            }

            let sqlFragment = '';

            if (andFragments.length > 0) sqlFragment += `WHERE  ${andFragments.join('AND')}`;

            if (orFragments.length > 0) sqlFragment += `AND (${orFragments.join('OR')})`;

            let havingSqlFragment = '';
            if (role) {
                havingSqlFragment = `HAVING JSON_CONTAINS(roles, JSON_OBJECT('roleId', ?))`;
                values.push(role);
            }

            const sql = `SELECT SQL_CALC_FOUND_ROWS
                            u.id,
                            u.username,
                            u.email,
                            u.phone,
                            u.user_state AS state,
                            JSON_ARRAYAGG(JSON_OBJECT('roleId', r.id, 'roleName', r.role_name)) AS roles
                           FROM
                                users AS u
                                    LEFT JOIN
                                users_roles AS ur ON u.id = ur.user_id
                                    LEFT JOIN
                                roles AS r ON ur.role_id = r.id
                        ${sqlFragment}
                        GROUP BY u.id
                        ${havingSqlFragment}
                        ORDER BY u.id DESC
                        LIMIT ? OFFSET ?;`

            const [list] = await pool.execute<Rows<UserRow>>(sql, [...values, `${pageSize}`, `${pageSize * (page - 1)}`]);
            const [[{total}]] = await pool.execute<Rows<{ total: number }>>(queryUserCount);

            return {
                total,
                list: list.map(item => {
                    const {roles} = item;
                    return {...item, roles: roles.filter(role => role.roleId !== null)}
                })
            }
        },

        async createUserRole(payload: { id: number, roleId: number }) {

            const {id: user_id, roleId: role_id} = payload;

            return pool.execute(createUserRoleSql, [user_id, role_id]);

        },

        async queryUserRoleList(payload: { id: number }) {

            const {id: user_id} = payload;
            const [roles] = await pool.execute<Rows<{ roleId: number, roleName: string, roleDes: string }>>(queryUserRoleListSql, [user_id]);
            return roles;
        },

        async delUserRole(payload: { id: number, roleId: number }) {

            const {id: user_id, roleId: role_id} = payload;

            return pool.execute(delUserRoleSql, [user_id, role_id]);

        },

        async queryUserPermissionList(payload: { id: number }) {
            //todo...

            const {id: userId} = payload;
            const [permissionList] = await pool.execute<Rows<PermissionRow>>(queryUserPermissionListSql, [userId]);

            return permissionList;

        },

        // async queryUserApiPermissionList(payload: { id: number }) {
        //
        //     const permissions = await this.queryUserPermissionList(payload);
        //
        //     return permissions.filter(({type}) => type === 'api');
        //
        // }
    }


}


