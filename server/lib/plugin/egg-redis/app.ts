import {Application} from "egg";

const Redis = require('ioredis');
import {Redis as IORedis} from "ioredis";

class RedisBootHook {
    private app: Application & { redis: IORedis };

    constructor(app) {
        this.app = app;
    }

    async didLoad() {

        const config = this.app.config.redis;
        if (typeof config.client === 'object') {

            this.app.redis = new Redis(config.client);

        } else if (Array.isArray(config.clients)) {

            this.app.redis = new Redis.cluster(config.clients);
        } else {
            throw  new Error('redis config error');
        }


    }

    async willReady() {

        try {

            await this.app.redis.setex('_init', 1, '_init');
            this.app.coreLogger.info('redis init success');
            console.log('redis init success');
        } catch (e) {
            console.log('redis init failed');
            throw e;

        }

    }


}

module.exports = RedisBootHook;