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

        if (data) {
            const hash = createHash('md5');
            data = hash.update(data).digest('hex');
        }

        return data;
    },

    genCreateExecution(table: string, row: Record<string, any>): [string, any[]] {

        const temp: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
            if (value !== undefined) temp[key] = value;
        })
        const keys = Object.keys(temp);
        const values = Object.values(temp);
        const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(()=>'?').join(',')});`;
        return [sql, values];
    },

    genCreateListExecution(table: string, rows: Record<string, any>[]): [string, any[]] {

        const temp: Record<string, any> = {};
        Object.entries(rows[0]).forEach(([key, value]) => {
            if (value !== undefined) temp[key] = value;
        })

        const keys = Object.keys(temp);
        const placeholder = `(${keys.map(() => '?').join(',')})`;
        const placeholders = rows.map(() => placeholder);
        const values = rows.map(row => {
            const tempRow = {}
            keys.forEach(key => tempRow[key] = row[key]);
            return Object.values(tempRow);
        });
        const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES ${placeholders.join(',')}`;

        return [sql, values.flat(1)];

    },

    genUpdateExecution(table: string, row: { id: number } & Record<string, any>): [string, any[]] {

        const {id} = row;
        const temp: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
            if (value !== undefined) temp[key] = value;
        })

        delete temp.id;
        const keys = Object.keys(temp);
        const values = Object.values(temp);
        const sql = `UPDATE ${table} SET ${keys.join(' = ?,')} = ? WHERE id = ?;`;

        return [sql, [...values, id]];

    },

    signToken(data: string | Buffer | Record<string, any>, options?: Record<string, any>): string {

        options = options ?? {expiresIn: '2h'};
        return jwt.sign(data, secret, options);
    },

    verifyToken(token: string | string[]): Record<string, any> | never {

        if (Array.isArray(token)) token = token.join('');
        return jwt.verify(token, secret);

    }

}

