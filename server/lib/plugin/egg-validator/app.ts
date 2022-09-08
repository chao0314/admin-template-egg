import Schema, {Rules} from 'async-validator';
// import Schema, {Rules, ValidateOption, Values} from 'async-validator';
import {Application} from 'egg';

class ValidatorBootHook {
    private app: Application;

    constructor(app) {
        this.app = app;
    }

    async didLoad() {

        this.app.validator = function (descriptor: Rules) {

            return new Schema(descriptor);

        }

    }


}

module.exports = ValidatorBootHook;