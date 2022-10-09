import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";

type Permission = { pid: number, name: string, des: string, type: string, level: number, path?: string, method?: string };
type Filter = { type?: string, keyword?: string, page: number, pageSize: number };

function mapColumnKey(payload: Permission & { id?: number }) {

    return Object.keys(payload).reduce((preObj, curKey) => {

        const value = payload[curKey];
        if (curKey === 'id') preObj.id = value;
        else preObj[`permiss_${curKey}`] = value;
        return preObj;
    }, {} as Record<string, any>);

}

export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;
    const delPermissionSql = `DELETE FROM permissions WHERE id = ?;`;
    const queryPermissionSqlFragment = `SELECT id, permiss_pid AS pid, permiss_name AS name,permiss_des AS des,
                                           permiss_type AS type,permiss_level AS level,
                                           permiss_path AS path, permiss_method AS method FROM  permissions`;


    return {

        async createPermission(payload: Permission) {

            const row = mapColumnKey(payload);
            const execution = helper.genCreateExecution('permissions', row);

            return pool.execute(...execution);

        },

        async updatePermission(payload: Permission & { id: number }) {

            const row = mapColumnKey(payload);

            const execution = helper.genUpdateExecution('permissions', row as { id: number } & Record<string, any>);

            return pool.execute(...execution);

        },

        async updatePermissionState(payload: { id: number, state: number }) {

            const {id, state} = payload;
            const execution = helper.genUpdateExecution('permissions', {id, permiss_state: state});

            return pool.execute(...execution);

        },

        async delPermission(payload: { id: number }) {

            const {id} = payload;

            return pool.execute(delPermissionSql, [id]);
        },

        async queryPermissionList(payload: Filter) {

            const {type, keyword, page = 1, pageSize = 10} = payload;

            const sqlFragments: string[] = [];
            const values: (string | number)[] = [];

            if (type) {
                sqlFragments.push('permiss_type = ?');
                values.push(type);
            }

            if (keyword) {
                sqlFragments.push(`(permiss_name LIKE '%${keyword}%' OR permiss_des LIKE '%${keyword}%')`);
                values.push(keyword, keyword);
            }
            const sql = `${queryPermissionSqlFragment} ${sqlFragments.length > 0 ? 'WHERE' : ''} ${sqlFragments.join('AND')} LIMIT ? OFFSET ?;`;

            return pool.execute<Rows<Permission & { id: number }>>(sql, [...values, pageSize, (page - 1) * pageSize]);

        }


    }


}
