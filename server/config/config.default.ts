import {Context, EggAppConfig, EggAppInfo, PowerPartial} from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_admin_template_egg_123456';

    // add your egg config in here
    config.middleware = [];
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

    config.onerror = {

        all(err: Error, ctx: Context) {

            console.log('egg error', err);
            ctx.body = 'egg error'
        }
    }

    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
