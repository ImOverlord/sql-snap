const express = require("express");
const sqlite = require("sqlite3");

const app = express();

const db = new sqlite.Database('./db');

app.use(express.json());

app.get("/users", (req, res) => {
    db.all('SELECT * FROM "users"', (err, result) => {
        const users = result || [];
        res.status(200).json({
            users
        })
    })
});

app.post("/users", (req, res) => {
    const { name } = req.body;

    db.all(`INSERT INTO users (name) values ("${name}")`, (err, result) => {
        res.send("OK");
    })
})

const createDB = (cb) => {
    db.all("CREATE TABLE IF NOT EXISTS users (name TEXT)", cb);
}

createDB(() => {
    app.listen(3002, () => {
        console.log('Ready');
    })
});
