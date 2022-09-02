import {RowDataPacket} from "mysql2";

export type MysqlConfig = {
    host:string,
    port:number,
    user:string,
    password:string,
    database:string,
    waitForConnections?: boolean,
    connectionLimit?: number,
    queueLimit?: number

}



export type  Row<T> = RowDataPacket & T;

export type Rows<T> = Row<T>[];

export  interface Info{

    currentTime:string
}
