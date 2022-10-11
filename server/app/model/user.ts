import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";
// import {Rows} from "../../lib/plugin/egg-mysql2/typings";
export type UserInfo = { id?: number, username?: string, email?: string, phone?: string, password: string };
export type FilterInfo = Partial<{
    role: number, origin: string, state: string | number, keyword: string,
    username: string, email: string, phone: string, pageSize: number, page: number
}>;
export type UserRow = { id: string, username: string, email: string, phone: string, state: number, roles: { roleId: number, roleName }[] };
export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;

    const queryFoundRows = `SELECT FOUND_ROWS() AS total;`;
    const queryByNameSql = `SELECT username FROM user WHERE username = ?;`;
    const queryByPhoneSql = `SELECT phone FROM template_db.user WHERE phone = ?;`;
    const queryByEmailSql = `SELECT email FROM template_db.user WHERE email = ?;`;
    const queryByNameAndPassSql = `SELECT username FROM template_db.user WHERE username= ? AND password= ?;`;
    const queryByEmailAndPassSql = `SELECT username FROM template_db.user WHERE email= ? AND password= ?;`;
    const queryByPhoneAndPassSql = `SELECT username FROM template_db.user WHERE phone= ? AND password= ?;`;
    const delByIdSql = `DELETE FROM user WHERE id = ?;`;
    const updateByIdSql = `UPDATE user SET username= ?,email= ?,phone= ?,password= ? WHERE id= ?;`;
    const updateUserStateByIdSql = `UPDATE user SET user_state = ? WHERE id= ?;`;
    const createUserRoleSql = `INSERT INTO users_roles (user_id,role_id) VALUES (?,?);`;
    const delUserRoleSql = `DELETE FROM users_roles WHERE user_id = ? AND role_id = ?;`;
    const queryUserRoleList = `SELECT  JSON_ARRAYAGG(JSON_OBJECT('roleId',
                                                    r.id,
                                                    'name',
                                                    r.role_name,
                                                    'des',
                                                    r.role_des)) AS roles
                                FROM users_roles AS ur LEFT JOIN  roles AS r ON ur.role_id = r.id
                                WHERE ur.user_id = ? GROUP BY ur.user_id;`
    return {

        async createUser(row: Record<string, any>) {

            const execution = helper.genCreateExecution('user', row);

            return pool.execute(...execution);

        },
        async queryByName(username: string) {

            return pool.execute<Rows<{ username: string }>>(queryByNameSql, [username]);

        },

        async queryByPhone(phone: string) {

            return pool.execute<Rows<{ phone: string }>>(queryByPhoneSql, [phone]);

        },

        async createByPhone(row: { phone: string, password: string }) {

            const execution = helper.genCreateExecution('user', row);
            return pool.execute(...execution);
        },

        async queryByEmail(email: string) {

            return pool.execute<Rows<{ email: string }>>(queryByEmailSql, [email]);
        },

        async createByEmail(row: { email: string, password: string }) {

            const execution = helper.genCreateExecution('user', row);
            return pool.execute(...execution);
        },

        async queryByNameAndPass({username, password}: { username: string, password: string }) {

            return pool.execute<Rows<{ username: string }>>(queryByNameAndPassSql, [username, password]);
        },

        async queryByEmailAndPass({email, password}: { email: string, password: string }) {

            return pool.execute<Rows<{ email: string }>>(queryByEmailAndPassSql, [email, password]);


        },
        async queryByPhoneAndPass({phone, password}: { phone: string, password: string }) {

            return pool.execute<Rows<{ phone: string }>>(queryByPhoneAndPassSql, [phone, password]);

        },

        async delUserById(id: string | number) {

            return pool.execute(delByIdSql, [id]);

        },

        async updateUserById(payload: UserInfo) {
            const {username, email, phone, password, id} = payload;
            return pool.execute(updateByIdSql, [username, email, phone, password, id]);
        },

        async updateUserState(payload: { id: number, state: 0 | 1 }) {
            const {id, state} = payload;

            return pool.execute(updateUserStateByIdSql, [state, id]);

        },

        async queryUserList(filter: FilterInfo) {

            /*
            * SELECT
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
                WHERE
                    u.user_state = 1 AND u.origin = 'github'
                        AND (u.username LIKE '%z%'
                        OR u.email LIKE '%chao%'
                        OR u.phone LIKE '%42%')
                GROUP BY u.id
                HAVING JSON_CONTAINS(roles, JSON_OBJECT('roleId', 2))
                LIMIT 1 OFFSET 0;
            *
            * */

            const {role, origin, state, username, email, phone, page = 1, pageSize = 10} = filter;

            const andFragments: string[] = [];
            const orFragments: string[] = [];
            const values: (number | string)[] = [];
            if (state) {
                andFragments.push(`u.user_state = ?`);
                values.push(state);
            }
            if (origin) {
                andFragments.push(`u.origin = ?`);
                values.push(origin);
            }
            if (username) {
                orFragments.push(`u.username LIKE %?%`);
                values.push(username);
            }
            if (email) {
                orFragments.push(`u.email LIKE %?%`);
                values.push(email);
            }
            if (phone) {
                orFragments.push(`u.phone LIKE %?%`);
                values.push(phone);
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
                        LIMIT ? OFFSET ?;`

            const [list] = await pool.execute<Rows<UserRow>>(sql, [...values, pageSize, pageSize * (page - 1)]);
            const [[{total}]] = await pool.execute<Rows<{ total: number }>>(queryFoundRows);
            return {
                total,
                list
            }
        },

        async createUserRole(payload: { id: number, roleId: number }) {

            const {id: user_id, roleId: role_id} = payload;

            return pool.execute(createUserRoleSql, [user_id, role_id]);

        },

        async queryUserRoleList(payload: { id: number }) {

            const {id: user_id} = payload;
            const [roles] = await pool.execute<Rows<{ roleId: number, roleName: string, roleDes: string }>>(queryUserRoleList, [user_id]);
            return roles;
        },

        async delUserRole(payload: { id: number, roleId: number }) {

            const {id: user_id, roleId: role_id} = payload;

            return pool.execute(delUserRoleSql, [user_id, role_id]);

        },

        async queryUserPermissions(payload: { id: number }) {
            //todo...
            console.log(payload);

            /*
            *
            * SELECT
    p.id,
    p.permiss_name,
    p.permiss_type,
    p.permiss_level,
    p.permiss_pid
FROM
    users AS u
        LEFT JOIN
    users_roles AS ur ON u.id = ur.user_id
        LEFT JOIN
    roles AS r ON ur.role_id = r.id
        LEFT JOIN
    roles_permissions AS rp ON ur.role_id = rp.role_id
        LEFT JOIN
    permissions AS p ON rp.role_id = p.id
WHERE
    u.id = 12 AND r.role_state = 1
        AND p.permiss_state = 1
GROUP BY p.id;
            *
            *
            * */

        }
    }


}


