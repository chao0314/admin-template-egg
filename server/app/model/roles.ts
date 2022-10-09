import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";


export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;

    const updateRoleSql = `UPDATE roles SET role_name = ?,role_des = ? WHERE id = ?;`;
    const updateRoleStateSql = `UPDATE roles SET role_state = ? WHERE id = ?;`;
    const delRoleSql = `DELETE FROM roles WHERE id = ?;`;
    const queryFoundRows = `SELECT FOUND_ROWS() AS total;`;
    // const delRolePermissions = ``
    return {

        async createRole(payload: { name: string, des: string }) {

            const {name, des} = payload;
            const row = {'role_name': name, 'role_des': des};
            const execution = helper.genCreateExecution('roles', row);
            return pool.execute(...execution);

        },

        async updateRole(payload: { id: number, name: string, des: string }) {

            const {id, name, des} = payload;

            return pool.execute(updateRoleSql, [name, des, id]);

        },

        async updateRoleState(payload: { id: number, state: 0 | 1 }) {

            const {id, state} = payload;

            return pool.execute(updateRoleStateSql, [state, id]);
        },

        async delRoleById(payload: { id: number }) {

            const {id} = payload;

            return pool.execute(delRoleSql, [id]);

        },

        async queryRoleList(payload: { keyword?: string, page: number, pageSize: number }) {

            const {keyword, page = 1, pageSize = 10} = payload;

            const sqlFragment = keyword ? `WHERE role_name LIKE '%?%' OR role_des LIKE '%?%';` : '';
            const values = keyword ? [keyword, keyword, pageSize, (page - 1) * pageSize] : [pageSize, (page - 1) * pageSize];

            let sql = `SELECT SQL_CALC_FOUND_ROWS
                            id, role_name AS name, role_des AS des
                        FROM
                            roles
                       
                        ${sqlFragment}
                       
                        LIMIT ? OFFSET ?;`;

            const [list] = await pool.execute<Rows<{ id: number, name: string, des: string }>>(sql, values);

            const [[{total}]] = await pool.execute<Rows<{ total: number }>>(queryFoundRows);

            return {
                total,
                list
            }

        },

        async updateRolePermission(payload: { roleId: number, permissIdList: number[] }) {

            const {roleId: role_id, permissIdList} = payload;

            const rows = permissIdList.map(permiss_id => ({role_id, permiss_id}));

            // first: delete all permissions of role
            const delExecution: [string, any[]] = [`DELETE FROM roles_permissions WHERE role_id = ?;`, [role_id]];

            // second: create new permission
            const creExecution = helper.genCreateListExecution('roles_permissions', rows);

            return pool.executeTransaction([delExecution, creExecution])

        }


    }


}


