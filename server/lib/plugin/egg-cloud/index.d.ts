declare module 'egg' {

    export interface Application {

        sendSms: (phoneNum: string | string[], value?: string | string[])=>void;

    }

}