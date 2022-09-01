import {Application} from "egg";
import {MysqlConfig} from "./typings";

const mysql2 = require('mysql2');

class BookHook {
    private app:Application&{mysql2:any};
    constructor(app) {
        this.app =  app;
        this.app.addSingleton('mysql2',this.createMysqlPool)
    }

    private createMysqlPool(config:MysqlConfig) {


        const pool = mysql2.createPool(config);
        return pool.promise();

    }

    async didLoad(){


        // this.app.addSingleton('mysql2',this.createMysqlPool)

    }

    async willReady(){

        try {

           const rows = await this.app.mysql2.execute('select now() as currentTime');
            console.log('mysql success',rows)
        }catch (e) {

            console.error('mysql error');
            throw  e;
        }

    }
}

module.exports = BookHook;
