import {Pool} from "mysql2/promise";
declare module 'egg'{

    export interface Application{

        mysql2:Pool
    }

}