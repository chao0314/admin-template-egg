import {v4 as uuidv4} from 'uuid';
import {createHash} from "crypto";
import jwt from 'jsonwebtoken';

const secret = fs.readFileSync('private.key')

export default {

    uuid() {
        return uuidv4()
    },

    randomHex(len: number, radix = 16) {

        return Math.random().toString(radix).slice(2, len + 2);

    },
    md5(data: string) {

        const hash = createHash('md5');
        return hash.update(data).digest('hex');
    },

    genCreateExecution(table: string, row: Record<string, any>): [string, any[]] {

        const keys = Object.keys(row);
        const values = Object.values(row);
        const sql = `INSERT INTO ${table} (${keys.join(',')}) values (${keys.map(()=>'?').join(',')});`;
        return [sql, values];

    },


}

