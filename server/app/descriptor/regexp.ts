import {loadFont} from "svg-captcha";

export const numberReg = /^\d+$/g;

export const stringReg = /^[a-zA-Z]+$/g;

export const validateNumber = (list: (string | number)[]) => {

    for (let i = 0; i < list.length; i++) {
        const num = `${list[i]}`;
        if (!numberReg.test(num)) return new Error(num);
    }

    return true;

}


export const validateNumberObj = (obj: Record<string, string | number>) => {

    const temp: Record<string, number> = {}
    const entries = Object.entries(obj);
    for (const [key, value] of entries) {

        if()

    }

}


export const validateString = (list: string[]) => {

    for (let i = 0; i < list.length; i++) {

        const str = list[i];
        if (!stringReg.test(str)) return new Error(str);
    }

    return true;

}


