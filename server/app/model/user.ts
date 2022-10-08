import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";
// import {Rows} from "../../lib/plugin/egg-mysql2/typings";
export type UserInfo = { id?: number, username?: string, email?: string, phone?: string, password: string };
export type FilterInfo = Partial<{
    role: number, origin: string, state: string | number, keyword: string,
    username: string, email: string, phone: string, pageSize: number, page: number
}>;
export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;

    const queryByNameSql = `SELECT username FROM user WHERE username = ?;`;
    const queryByPhoneSql = `SELECT phone FROM template_db.user WHERE phone = ?;`;
    const queryByEmailSql = `SELECT email FROM template_db.user WHERE email = ?;`;
    const queryByNameAndPassSql = `SELECT username FROM template_db.user WHERE username= ? AND password= ?;`;
    const queryByEmailAndPassSql = `SELECT username FROM template_db.user WHERE email= ? AND password= ?;`;
    const queryByPhoneAndPassSql = `SELECT username FROM template_db.user WHERE phone= ? AND password= ?;`;
    const delByIdSql = `DELETE FROM user WHERE id = ?;`;
    const updateByIdSql = `UPDATE user SET username= ?,email= ?,phone= ?,password= ? WHERE id= ?;`;
    const updateUserStateByIdSql = `UPDATE user SET user_state = ? WHERE id= ?;`;
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
            const {role, origin, state, username, email, phone, page = 1, pageSize = 10} = filter;

            const andFragments: string[] = [];
            const orFragments: string[] = [];
            if (state) andFragments.push(`u.user_state = ?`);
            if (origin) andFragments.push(`u.origin = ?`);
            if (username) orFragments.push(`u.username LIKE %?%`);
            if (email) orFragments.push(`u.email LIKE %?%`);
            if (phone) orFragments.push(`u.phone LIKE %?%`);

            let sqlFragment = '';

            if (andFragments.length > 0) sqlFragment += `WHERE  ${andFragments.join('AND')}`;

            if (orFragments.length > 0) sqlFragment += `AND (${orFragments.join('OR')})`;


            const sql = `SELECT 
                            u.id,
                            u.username,
                            u.email,
                            u.phone,
                            u.user_state AS state,
                            JSON_ARRAYAGG(ur.role_id) AS roles
                        FROM
                            users AS u
                                LEFT JOIN
                            users_roles AS ur ON u.id = ur.user_id
                        ${sqlFragment}
                        GROUP BY u.id
                        LIMIT ? OFFSET ?;`
            type Row = { id: string, username: string, email: string, phone: string, state: number, roles: number[] };
            const [res] = await pool.execute<Rows<Row>>(sql, [state, origin, username, email, phone, pageSize, pageSize * (page - 1)]);

            return role ? res.filter((item => item.roles.includes(role))) : res;
        }
    }


}


