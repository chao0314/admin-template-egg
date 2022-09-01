import { EggPlugin } from 'egg';
const path =  require('path');

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

    mysql2:{
        enable:true,
        path:path.join(__dirname,'../lib/plugin/egg-mysql2')
    }
};

export default plugin;
