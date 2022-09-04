import { Controller } from 'egg';

//yuexpioyxjvkbicj
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;

    ctx.body = await ctx.service.test.sayHi('egg');
  }

  async getCaptcha(){

    const {data,text} =  this.app.createCaptcha();
    console.log(text)

    this.ctx.body = data


  }
}
