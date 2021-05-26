# Snap

SQL-Snap comes with mutiple class, but the core functionalies come with the class **Snap**

You will instanciate the class with the config to connect to the PostGress Database you want to use.

```ts
import { Snap } from 'sql-snap';

const snap = new Snap('postgres://user:password@127.0.0.1:5432/test');
// or
const snap = new Snap({
    host: '127.0.0.1',
    port: 5432,
    username: "user",
    password: "password",
    database: "test",
    dialect: 'pg'
});

// For Sqlite, in host put the path to the database file

```

The object passed will used to start a new database connection.

## connect

```ts
/** Prototype */
connect(): Promise<void>;


snap.connect()
.then(() => {
    console.log(`Snap is Connected`);
})
.catch((error) => {
    console.log(`Error Connecting`);
    console.error(error);
});
```

Once snap instanciated, you will be able to connect.

## query

```ts
/** Prototype */
query<T extends object = any>(statement: string): Promise<IQueryResult<T>>;

snap.query(`SELECT * FROM test.table`)
.then((result) => {
    console.log(result);
})
.catch((error) => {
    console.error(error)
});

```

Once connected you will be able to send queries, to the Database

## runFile

```ts
/** Prototype */
runFile(filePath: string): Promise<any>;

```

You may aussi run a sql file.

## disconnect

```ts
/** Prototype */
disconnect(): Promise<void>
```

Once you are done, you can disconnect.

## Futhermore

Using Snap class alone is pretty useless as it just wraps the db connector. Where sql-snap is useful is when you use the [Server and Client](Server-Client.md). Which makes it possible use Snap during Tests. For more information read the [Jest](Jest.md) page.
