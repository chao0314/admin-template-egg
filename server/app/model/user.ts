import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";

export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;

    const queryByNameSql = `SELECT username FROM user where username = ?;`;
    const queryByPhoneSql = `SELECT phone FROM template_db.user where phone = ?;`;
    const queryByEmailSql = `SELECT email FROM template_db.user where email = ?;`;
    const queryByNameAndPassSql = `SELECT username FROM template_db.user where username= ? AND password= ?;`;
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
        }
    }


}
