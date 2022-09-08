export type SvgCaptchaOptions = Partial<{
    size: number
    width: number,
    height: number,
    fontSize: number
    ignoreChars: string,
    noise: number
    color: boolean
    background: string

}>

// export type EmailReceiver = Partial<{
//
//     from: string, // sender address
//     to: string // list of receivers
//     subject: string, // Subject line
//     text: string, // plain text body
//     html: string // html body
//
// }>

export type MailBody = {
    subject: string,
    text: string,
    html?: string
}


declare module 'egg' {

    export interface Context {

        success: (data?: any) => void;
        failure: (data?: any) => void;
        error: (error: Error) => void;
        badRequest: (params?: string) => void;
        unauthorized: () => void;
        forbidden: () => void;
    }

    export interface IHelper {

        uuid: () => string

    }
}