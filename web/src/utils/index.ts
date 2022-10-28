// 把obj中的值与 obj2值比较，不同的保留，白名单中的保留


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


export const filterObj = (obj: Record<string, any>) => {

    const temp: Record<string, any> = {};

    Object.keys(obj).forEach(key => {

        const value = obj[key];

        if (value !== undefined || value !== '')
            temp[key] = value;

    })

    return temp;

}


export const downloadFile = (data: Blob, filename: string = 'file.xlsx') => {

    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}