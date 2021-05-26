const execSync = require('child_process').execSync;

module.exports = async() => {
    /** Kill SnapServer */
    execSync(`kill ${global['__SNAP_PID__']}`);
    /** Kill ExpressServer */
    execSync(`kill ${global['__SERV_PID__']}`);
};
