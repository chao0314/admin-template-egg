export type TencentCloudSmsParams = {

    SmsSdkAppId: string,
    SignName: string,
    TemplateId: string,
    TemplateParamSet: string[],
    PhoneNumberSet: string[],
    SessionContext?: string,
    ExtendCode?: string,
    SenderId?: string,
}