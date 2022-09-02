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
        return pool.promise();

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
