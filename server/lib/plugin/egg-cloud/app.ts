import {Application} from "egg";

import * as tencentCloud from 'tencentcloud-sdk-nodejs-sms';

const SmsClient = tencentCloud.sms.v20210111.Client;

class CloudBootHook {

    private app: Application

    constructor(app) {
        this.app = app;
    }

    async didLoad() {

        const config = this.app.config.cloud;
        if (typeof config.tencentCloud === 'object') {

            const {client, sms} = config.tencentCloud;

            const smsClient = new SmsClient(client);

            this.app.sendSms = function (phoneNum: string | string[], value?: string | string[]) {

                const PhoneNumberSet = Array.isArray(phoneNum) ? phoneNum : [phoneNum];
                const TemplateParamSet = Array.isArray(value) ? value : [value];

                smsClient.SendSms({
                    ...sms,
                    PhoneNumberSet,
                    TemplateParamSet
                });

            }


        }


    }
}

module.exports = CloudBootHook;