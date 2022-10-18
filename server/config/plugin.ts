import {EggPlugin} from 'egg';

const path = require('path');

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    cors : {
        enable: true,
        package: 'egg-cors',
    },

    mysql2: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-mysql2')
    },
    redis: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-redis')
    },
    cloud: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-cloud')
    },
    validator: {
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-validator')
    }


};

export default plugin;
