import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";

export type PermissionType = { pid: number, name: string, des: string, type: string, state?: number, level: number, path?: string, method?: string };
export type Filter = { type?: string, keyword?: string, page: number, pageSize: number };
export type PermissionRow = PermissionType & { id: number };

function mapColumnKey(payload: PermissionType & { id?: number }) {

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
    const queryFoundRows = `SELECT FOUND_ROWS() AS total;`;
    const delPermissionSql = `DELETE FROM permissions WHERE id = ?;`;
    const queryPermissionSqlFragment = `SELECT SQL_CALC_FOUND_ROWS
                                           id, permiss_pid AS pid, permiss_name AS name,permiss_des AS des,
                                           permiss_type AS type,permiss_level AS level,permiss_state AS state,
                                           permiss_path AS path, permiss_method AS method FROM  permissions`;

    const queryPermissionByLevelSql = `SELECT id, permiss_pid AS pid, permiss_name AS name,permiss_des AS des,
                                           permiss_type AS type,permiss_level AS level,permiss_state AS state,
                                           permiss_path AS path, permiss_method AS method FROM  permissions
                                           WHERE permiss_level= ?`;


    return {

        async createPermission(payload: PermissionType) {

            const row = mapColumnKey(payload);
            const execution = helper.genCreateExecution('permissions', row);

            return pool.execute(...execution);

        },

        async updatePermission(payload: PermissionType & { id: number }) {

            const row = mapColumnKey(payload);

            const execution = helper.genUpdateExecution('permissions', row as { id: number } & Record<string, any>);

            return pool.execute(...execution);

        },

        async updatePermissionState(payload: { id: number, state: 0 | 1 }) {

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
            }
            // const sql = `${queryPermissionSqlFragment} ${sqlFragments.length > 0 ? 'WHERE' : ''} ${sqlFragments.join('AND')} ORDER BY permissions.id DESC LIMIT ? OFFSET ?;`;
            const sql = `${queryPermissionSqlFragment} ${sqlFragments.length > 0 ? 'WHERE' : ''} ${sqlFragments.join('AND')}  LIMIT ? OFFSET ?;`;
            // console.log('queryPermissionList---sql---', sql);
            const [list] = await pool.execute<Rows<PermissionRow>>(sql, [...values, `${pageSize}`, `${(page - 1) * pageSize}`]);
            const [[{total}]] = await pool.execute<Rows<{ total: number }>>(queryFoundRows);

            return {total, list};
        },

        async queryPermissionTypeList(payload = {level: 0}) {

            const {level} = payload;

            const [list] = await pool.execute<Rows<PermissionRow>>(queryPermissionByLevelSql, [level]);

            return {list};


        },


        async queryAllPermissionList() {

            const [list] = await pool.execute<Rows<PermissionRow>>(queryPermissionSqlFragment);
            return {list};

        }


    }


}
