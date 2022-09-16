import {Service} from 'egg';
import user from "../model/user";
export default class Home extends Service{

    async createUser(username:string,password:string) {

        const {app,ctx} =  this;
        const model =  user(app);
        const passHash =ctx.helper.md5(password);
        const [res] =  await model.queryByName(username);
        if (res.length >0) return

        // const res = await model.create(username,passHash);
        console.log(passHash);
        console.log(res);


    }


}