import { EggPlugin } from 'egg';

const path =  require('path');

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

    mysql2:{
        enable:false,
        path:path.join(__dirname,'../lib/plugin/egg-mysql2')
    },
    redis:{
        enable:true,
        path:path.join(__dirname,'../lib/plugin/egg-redis')
    }
};

export default plugin;
