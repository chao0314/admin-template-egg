import {Redis as IORedis} from "ioredis";

declare module 'egg'{

    export interface Application{
        redis: IORedis
    }
}