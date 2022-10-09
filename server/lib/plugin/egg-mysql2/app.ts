import {Application} from "egg";
import {MysqlConfig, Rows, Info} from "./typings";
import {Pool} from "mysql2/promise";

const mysql2 = require('mysql2');

class MySql2BootHook {
    private app: Application & { mysql2: Pool };

    constructor(app) {
        this.app = app;
        this.app.addSingleton('mysql2', this.createMysqlPool)
    }

    private createMysqlPool(config: MysqlConfig) {

        const pool = mysql2.createPool(config);
        const promisePool = pool.promise();

        // beginTransaction
        // commit
        // rollback

        promisePool.executeTransaction = async (executions: [sql: string, values: any[]][]): Promise<void> | never => {

            const connection = await promisePool.getConnection();

            await connection.beginTransaction();

            try {

                for (const execution of executions) {

                    const [sql, values] = execution;
                    await connection.execute(sql, values);
                }

                await connection.commit();

            } catch (e: unknown) {

                this.app.coreLogger.error(e);

                await connection.rollback();

                throw e;

            }


        }


        return promisePool;

    }

    async didLoad() {

        // this.app.addSingleton('mysql2',this.createMysqlPool)

    }

    async willReady() {

        try {
            const [rows] = await this.app.mysql2.execute<Rows<Info>>('select now() as currentTime');
            this.app.coreLogger.info('mysql2 pool init success ,time is: ', rows[0].currentTime);
            console.log('mysql2 pool init success ,time is: ', rows[0].currentTime);
        } catch (e) {
            console.error('mysql2 init failed', e);
            throw  e;
        }

    }
}

module.exports = MySql2BootHook;
