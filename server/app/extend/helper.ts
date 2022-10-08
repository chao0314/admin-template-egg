import {v4 as uuidv4} from 'uuid';
import {createHash} from "crypto";
import jwt from 'jsonwebtoken';
import {readFileSync} from 'fs';

const secret = readFileSync('secret.key');

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

    signToken(data: string | Buffer | Record<string, any>, options?: Record<string, any>): string {

        options = options ?? {expiresIn: '2h'};
        return jwt.sign(data, secret, options);
    },

    verifyToken(token: string): Record<string, any> | never {

        return jwt.verify(token, secret);

    }

}

