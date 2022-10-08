import {Application} from 'egg';

export default (app: Application) => {
    const {controller, router, config: {apiVersion}} = app;

    router.get('/', controller.home.index);

    router.get('/captcha', controller.home.getCaptcha);
    router.get('/mail', controller.home.sendMail);
    router.get('/sms', controller.home.sendSms);

    router.post('/singUp', controller.home.singUp)
    router.post('/singUpEmail', controller.home.singUpEmail);
    router.post('/singUpPhone', controller.home.singUpPhone);

    router.post(`${apiVersion}/createUser`,);
};
