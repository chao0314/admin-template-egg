import {Context} from "egg";
import {Rows} from "../../lib/plugin/egg-mysql2/typings";

export  type RoleRow = { id: number, name: string, des: string };
export type PermissionRow = { id: number, name: string, type: string, level: number, pid: number };
export default function (ctx: Context) {
    const {app, helper} = ctx;
    const pool = app.mysql2;

    // const updateRoleSql = `UPDATE roles SET role_name = ?,role_des = ? WHERE id = ?;`;
    const updateRoleStateSql = `UPDATE roles SET role_state = ? WHERE id = ?;`;
    const delRoleSql = `DELETE FROM roles WHERE id = ?;`;
    const queryFoundRows = `SELECT FOUND_ROWS() AS total;`;
    const queryRoleByNameSql = `SELECT role_name as name,role_des as des FROM roles WHERE role_name = ?;`;
    const delRolePermissionSql = `DELETE FROM roles_permissions WHERE role_id = ?;`
    const queryRolePermissionListSql = `SELECT 
                                            p.id,
                                            p.permiss_name AS name,
                                            p.permiss_type AS type,
                                            p.permiss_level AS level,
                                            p.permiss_pid AS pid
                                        FROM
                                            roles AS r
                                                LEFT JOIN
                                            roles_permissions AS rp ON r.id = rp.role_id
                                                LEFT JOIN
                                            permissions AS p ON rp.permiss_id = p.id
                                        WHERE
                                            r.id = ?  AND p.permiss_state = 1
                                        GROUP BY p.id;`;
    return {

        async createRole(payload: { name: string, des: string }) {

            const {name, des} = payload;
            const row = {'role_name': name, 'role_des': des};

            const execution = helper.genCreateExecution('roles', row);
            return pool.execute(...execution);

        },

        async queryRoleByName(payload: { name: string }) {

            const {name} = payload;

            const [res] = await pool.execute<Rows<{ name: string, des: string }>>(queryRoleByNameSql, [name]);

            return res;

        },

        async updateRole(payload: { id: number, name: string, des: string }) {

            const {id, name, des} = payload;
            const execution = helper.genUpdateExecution('roles', {id, role_name: name, role_des: des});

            return pool.execute(...execution);

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

            const sqlFragment = keyword ? `WHERE role_name LIKE '%${keyword}%' OR role_des LIKE '%${keyword}%'` : '';

            let sql = `SELECT SQL_CALC_FOUND_ROWS
                            id, role_name AS name, role_des AS des,role_state AS state
                        FROM
                            roles
                            
                        ${sqlFragment}
                       
                        LIMIT ? OFFSET ?;`;

            const [list] = await pool.execute<Rows<RoleRow>>(sql, [`${pageSize}`, `${(page - 1) * pageSize}`]);

            const [[{total}]] = await pool.execute<Rows<{ total: number }>>(queryFoundRows);

            return {total, list};

        },

        async updateRolePermission(payload: { id: number, permissIdList: number[] }) {

            const {id: role_id, permissIdList} = payload;

            const rows = permissIdList.map(permiss_id => ({role_id, permiss_id}));

            // first: delete all permissions of role
            const delExecution: [string, any[]] = [delRolePermissionSql, [role_id]];

            // second: create new permission
            const creExecution = helper.genCreateListExecution('roles_permissions', rows);

            return pool.executeTransaction([delExecution, creExecution])

        },

        async queryRolePermissionList(payload: { id: number }) {

            const {id: permissionId} = payload;

            const [permissionList] = await pool.execute<Rows<PermissionRow>>(queryRolePermissionListSql, [permissionId]);

            return permissionList;
        }


    }


}


