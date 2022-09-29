import {Context, EggAppConfig, EggAppInfo, PowerPartial} from 'egg';
import * as path from "path";

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_admin_template_egg_123456';

    // add your egg config in here
    config.middleware = [];

    config.security = {
        csrf: {
            enable: false
        }
    }

    config.i18n = {
        defaultLocale: 'zh-CN'
    }

    config.mysql2 = {
        client: {
            host: '117.50.187.251',
            port: 3306,
            user: 'template',
            password: 'template',
            database: 'template_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }

    };
    config.redis = {
        client: {
            host: '117.50.187.251',
            port: 6379
        }
    };
    config.svgCaptcha = {
        size: 4, // 验证码长度
        width: 160,// 验证码图片宽度
        height: 60,// 验证码图片高度
        fontSize: 50, // 验证码文字大小
        ignoreChars: '0oO1ilI', // 验证码字符中排除内容 0o1i
        noise: 4, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee' // 验证码图片背景颜色
    }
    config.mailer = {
        host: "smtp.qq.com",
        port: 465,
        secure: true,
        auth: {
            user: "125301689@qq.com", // generated ethereal user
            pass: "yuexpioyxjvkbicj", // generated ethereal password
        }
    }
    config.cloud = {

        tencentCloud: {
            secretPath: path.join(__dirname, '../.sec'),
            client: {
                //注意秘钥的安全性
                credential: {
                    secretId: null,
                    secretKey: null,
                },
                region: "ap-guangzhou",
            },

            sms: {
                SmsSdkAppId: '1400733130',
                SignName: '个人技术记录个人网',
                TemplateId: '1533430'
            }

        }

    }

    config.onerror = {

        all(err: Error, ctx: Context) {

            console.error('Server Internal Error !', err);
            ctx.logger.error('Server Internal Error !', err);
            ctx.status = 500;
            ctx.body = 'Server Internal Error!'
        }
    }

    // add your special config in here
    const comConfig = {
        // sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
        apiVersion: "v1"
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...comConfig,
    };
};
