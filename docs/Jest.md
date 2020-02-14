# Jest

Using Snap class alone is pretty useless as it just wraps the db connector. However when you use a test framework, like Jest, every test files are run in a different worker. This means you will need to start a new connection everytime. This can be very heavy.

Using the Server and Client, you just have to start the server when you launch the tests and create a new Client before each tests. Client are very light weight as they just start a WebSocket connection.

## Setup SQL-Snap in Jest

Jest supports startup and teardown files. You can then set a Environment for each test files.

### setup

To create the sql-snap server, you will want to init it in a setup file


```ts
//setup.ts
import { spawn } from 'child_process';

export default async() => {
    return new Promise((resolve, reject) => {
        /** run script that start server */
        const service = spawn(`node`, ['SnapServer.js']);
        /** save server pid to kill on teardown */
        global['__SNAP_PID__'] = service.pid;
        /** wait for ready message to start tests suite */
        service.stdout.on('data', (data: Buffer) => {
            const output = data.toString();
            if (output.match(/Ready/))
                resolve();
            if (output.match(/Error/))
                reject();
        });
    });
};
```

```ts
//SnapServer.js

const Server = require("sql-snap").SnapServer;

new Server({
    port: 3001, // port the server should start on
    dbConfig: { // Config to connect to the database
        connectionString: 'postgres://Heroes:Lifeaz2019@127.0.0.1:5432/DatabaseTest'
    }
});
```

### Jest Environment

```js
// sql-snap.env.js
const nodeEnvironment = require('jest-environment-node');
const SnapClient = require('sql-snap').SnapClient;
const setup = require("./setup");

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
        const client = new SnapClient(`ws://127.0.0.1:3001`);
        /** Save the Client to global */
        this.global['snap'] = client;
        /** Connect the client */
        await client.connect();
        /** Run a setup sql script */
        await client.query(setup);
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

```

### Teardown

```ts
//teardown.ts

import { execSync } from "child_process";

export default async() => {
    /** Kill SnapServer */
    execSync(`kill ${global['__SNAP_PID__']}`);
};

```

### Jest Config

You will then need to update the Jest Config File

```js
module.exports = {
  globalSetup: './setup.ts',
  globalTeardown: './teardown.ts',
  testEnvironment: './sql-snap.env.js',
};

```
