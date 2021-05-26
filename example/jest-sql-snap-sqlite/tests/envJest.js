// sql-snap.env.js
const nodeEnvironment = require('jest-environment-node');
const SnapClient = require('sql-snap').SnapClient;

/**
 * SnapEnvironment
 */
class SnapEnvironment extends nodeEnvironment {
    constructor(config) {
        super(config);
    }

    /**
     * setup
     * @description Setup Snap Client
     */
    async setup() {
        await super.setup();
        /** Start a new SnapClient */
        const client = new SnapClient(`ws://127.0.0.1:3005`);
        /** Save the Client to global */
        this.global['snap'] = client;
        /** Connect the client */
        await client.connect();
        /** Run a setup sql script */
        // await client.query(setup);
    }

    /**
     * Teardown Env
     */
    async teardown() {
        await super.teardown();
    }

    /**
     * RUN
     * @param script
     */
    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = SnapEnvironment;
