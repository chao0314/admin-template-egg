import {Application} from "egg";

const svgCaptcha = require('svg-captcha');
import {SvgCaptchaOptions} from "./index";

export default {

    createCaptcha(this:Application,options?:SvgCaptchaOptions):{data:string,text:string} {

        console.log('options',options);
        return svgCaptcha.create(options??this.config.svgCaptcha);


    }


}
