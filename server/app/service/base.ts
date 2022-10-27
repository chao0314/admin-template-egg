import {Service} from 'egg';
// import {Locale} from "../../config/locale";

export default class Base extends Service {

    async genXlsxFile<T>(list: T[]) {

        const {ctx} = this;

        if (list === undefined || list.length === 0) return;
        const columns:{value:string,label:string}[] = Object.keys(list[0]).map(key => ({value: key, label: ctx.__(key)}));

        const rows: (string | number)[][] = [];

        for (const item of list) {
            rows.push(Object.keys(item).map(key => {
                const value = item[key];
                if (Array.isArray(value)) return value.join(',');
                return value

            }))

        }

        return await ctx.helper.genXlsxFile(columns, rows);
    }


}