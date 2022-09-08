import {Application} from "egg";

const svgCaptcha = require('svg-captcha');
const nodemailer = require("nodemailer");

import { MailBody, SvgCaptchaOptions} from "./index";

export default {

    createCaptcha(this: Application, options?: SvgCaptchaOptions): { data: string, text: string } {

        return svgCaptcha.create(options ?? this.config.svgCaptcha);


    },

    async sendMail(this: Application, to: string | string[], {subject='', text='', html=''}: MailBody, form?: string) {

        const config = this.config.mailer;

        let transporter = nodemailer.createTransport(config);
        if (Array.isArray(to)) to = to.join(', ');
        // send mail with defined transport object
        await transporter.sendMail({
            from: form ?? config.auth.user,
            to,
            subject,
            text,
            html
        });


    },




}


