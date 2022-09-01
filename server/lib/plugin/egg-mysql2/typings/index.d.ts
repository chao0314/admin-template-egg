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