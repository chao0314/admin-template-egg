import {Service} from 'egg';
import {Writable} from "stream";
// import {Locale} from "../../config/locale";

export default class Base extends Service {

    async genXlsxFile(list: Record<string, any>[],stream?:Writable) {

        const {ctx} = this;

        if (list === undefined || list.length === 0) return;
        const columns: { value: string, label: string }[] = Object.keys(list[0]).map(key => ({
            value: key,
            label: ctx.__(key)
        }));

        const rows: (string | number)[][] = [];

        for (const item of list) {
            rows.push(Object.keys(item).map(key => {
                const value = item[key];
                if (Array.isArray(value)) return value.join(',');
                return value

            }))

        }

        return await ctx.helper.genXlsxFile(columns, rows,stream);
    }

    async genRowsFromXlsxFile(filePath:string) {

        const {ctx} = this;

        await  ctx.helper.genRowsFromXlsxFile(filePath);


    }


}