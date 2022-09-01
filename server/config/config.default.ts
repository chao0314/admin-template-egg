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
            host:'117.50.187.251',
            port:3306,
            user:'template',
            password:'template',
            database:'template_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }

    }

    config.onerror =  {

        all(err:Error,ctx:Context){

            console.log('egg error',err);
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
