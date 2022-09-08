import {v4 as uuidv4} from 'uuid';

export default {

    uuid() {
        return uuidv4()
    },

    randomHex(len: number, radix = 16) {

        return Math.random().toString(radix).slice(2, len + 2);

    }
}

