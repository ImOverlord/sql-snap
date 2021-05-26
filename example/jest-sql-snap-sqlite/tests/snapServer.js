const Server = require("sql-snap").SnapServer;

new Server({
    port: 3005, // port the server should start on
    db: { // Config to connect to the database
        host: './db',
        database: 'random',
        dialect: 'sqlite'
    }
});

console.log("End")
