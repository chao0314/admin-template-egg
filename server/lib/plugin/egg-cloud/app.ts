import {Application} from "egg";

import * as tencentCloud from 'tencentcloud-sdk-nodejs-sms';

import {createInterface} from "readline";
import {createReadStream} from "fs";

const SmsClient = tencentCloud.sms.v20210111.Client;

class CloudBootHook {

    private app: Application

    constructor(app) {
        this.app = app;
    }

    async didLoad() {

        const config = this.app.config.cloud;
        if (typeof config.tencentCloud === 'object') {

            const {client, sms, secretPath} = config.tencentCloud;
            let smsClient;
            // secret path 配置的 参数 替换掉 硬编码(不安全)
            if (secretPath) {
                const rl = createInterface({
                    input: createReadStream(secretPath)
                    // output: process.stdout
                });

                rl.on('line', (data) => {

                    //secretId:xxx
                    //secretKey:xxx
                    const [key, value] = data.split(':');
                    client.credential[key] = value;

                })

                rl.on('close', () => {

                    smsClient = new SmsClient(client);
                })

            }


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