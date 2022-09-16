import {Application} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";
// import {Rows} from "../../lib/plugin/egg-mysql2/typings";

export default function (app: Application) {

    const pool = app.mysql2;

    const createSql = `INSERT INTO user (username,password) values (?,?);`;
    const queryByNameSql = `SELECT username FROM user where username = ?;`

    return {

        async create(username: string, password: string) {

            return pool.execute(createSql, [username, password]);

        },
        async queryByName(username: string) {

            return pool.execute<Rows<{ username: string }>>(queryByNameSql, [username]);

        }


    }


}
