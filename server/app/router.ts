import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.get('/captcha',controller.home.getCaptcha);
  router.get('/mail',controller.home.sendMail);
  router.get('/sms',controller.home.sendSms);


};
