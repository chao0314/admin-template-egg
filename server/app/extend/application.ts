const svgCaptcha = require('svg-captcha');
const svgCaptchaOptions = {
    size: 4, // 验证码长度
    width: 160,// 验证码图片宽度
    height: 60,// 验证码图片高度
    fontSize: 50, // 验证码文字大小
    ignoreChars: '0oO1ilI', // 验证码字符中排除内容 0o1i
    noise: 4, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#eee' // 验证码图片背景颜色
}

module.exports = {

    createCaptcha(options) {


    }


}