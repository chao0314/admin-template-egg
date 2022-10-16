export const numberReg = /^\d+$/;

export const validateNumberObj = (obj: Record<string, any>) => {

    const result: Record<string, number> = {}
    const entries = Object.entries(obj);

    for (const [key, value] of entries) {

        if (value !== undefined) {

            if (numberReg.test(value)) result[key] = Number(value);
            else return new Error(`${key} ${value}`);

        }
    }

    return result;

}


export const validateStringObj = (obj: Record<string, any>) => {

    const result: Record<string, string> = {};

    const entries = Object.entries(obj);

    for (const [key, value] of entries) {

        if (value !== undefined)
            result[key] = value.replace(/\</g, "&lt").replace(/\>/g, "&gt");
    }

    return result;

}





