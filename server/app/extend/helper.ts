import {v4 as uuidv4} from 'uuid';
import {createHash} from "crypto";

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
    }
}

