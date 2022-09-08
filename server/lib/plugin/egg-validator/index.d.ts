import Schema, {Rules, ValidateError as ValError, ValidateFieldsError} from "async-validator";

export type Descriptor = Rules;
export type ValidateError = {
    errors: ValError[],
    fields: ValidateFieldsError
}
declare module 'egg' {

    export interface Application {

        validator: (descriptor: Rules) => Schema;

    }
}