export const exclude = (obj: Record<string, any>, obj2: Record<string, any>, whiteKeys = ['id']) => {

    const temp: Record<string, any> = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (!whiteKeys.includes(key)) {
            if (obj[key] !== obj2[key]) temp[key] = value
        } else temp[key] = value
    })


    return temp;

}