const spawn = require('child_process').spawn;
const sync = require("child_process").spawnSync;

module.exports = async() => {
    return new Promise((resolve, reject) => {
        /** run script that start server */
        const service = spawn(`node`, ['./tests/snapServer.js']);
        // console.log(service.output.toString());
        /** save server pid to kill on teardown */
        global['__SNAP_PID__'] = service.pid;
        /** wait for ready message to start tests suite */
        service.stdout.on('data', (data) => {
            const output = data.toString();
            if (output.match(/Ready/))
                resolve();
            if (output.match(/Error/))
                reject();
        });
    })
    .then(() => {
        return new Promise((resolve, reject) => {
            const service = spawn(`node`, ['./src/app.js']);
            /** save server pid to kill on teardown */
            global['__SERV_PID__'] = service.pid;
            /** wait test express server to start */
            service.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(output);
                if (output.match(/Ready/))
                    resolve();
                if (output.match(/Error/))
                    reject();
            });
        })
    })
};
