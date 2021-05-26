const fetch = require("node-fetch")

describe("User Test", () => {

    const getUsersFromDb = () => {
        return snap.query('SELECT * FROM "users"')
        .then((result) => {
            return result.data.rows;
        })
    }

    const getDbError = () => {
        return snap.query('SELECT * FROM qwerwwe')
    }

    it("Should add User", (done) => {
        const refName = "test"

        var raw = JSON.stringify({
            "name": refName
        });

        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3002/users", requestOptions)
        .then(() => {
            return getUsersFromDb()
        })
        .then((users) => {
            const name = users[users.length - 1].name;
            expect(name).toBe(refName);
            done();
        })
    });

    it("Should get Users", (done) => {
        let users;
        fetch("http://localhost:3002/users")
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            users = response.users;
            return getUsersFromDb()
        })
        .then((db) => {
            expect(db.length).toBe(users.length);
            done();
        })
    });

    it("Db Error", (done) => {
        getDbError()
        .then(() => {
            fail();
        })
        .catch((error) => {
            expect(error.type).toBe("error");
            done();
        });
    })
});
