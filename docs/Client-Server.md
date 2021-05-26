# Client and Server

In **sql-snap**, a client and a server can be used to communicate. This makes it possible to use snap in multiple processes. The Client and Server communcate using WebSockets.

## Protocol

All message passes by the Client and Server, will be using the interface below.

```ts
interface IMessage<T = any> {
    id?: string;
    type: 'query' | 'response' | 'error';
    data: T;
}
```

 * id: is randomly generated, and is used to call the correct callback.
 * type: is used to determine how to handle to message
 * data: can be anything (most of the time its a sql statement or response, but can also be an error message)

## Server

Server constructor, will ask for an *ISnapServerConfig*

```ts
import { IDatabaseConfig } from './IDatabaseConfig';

export interface ISnapServerConfig {
    /** port {number}: WebSocket Port to be used */
    port: number;
    /** db {string | IDatabaseConfig}: Config to connect to databse */
    db: string | IDatabaseConfig;
}
```

* port: on which the server will listen
* db: Config to connect to the database

It will then listen for messages, and pass them along to Snap.

## Client

Client Constructor, will ask for the WebSocket connection url.

```ts
import { SnapClient } from 'sql-snap';

const snap = new SnapClient(`ws://127.0.0.1:3001`);
```

### connect

```ts

connect(): Promise<void>

snap.connect()
.then(() => {
    console.log(`Connected`);
})
.catch((error) => {
    console.log(`error`);
    console.error(error);
});

```

Connects to the socket.

### query

```ts
query(statement: string);

```

Method to directly send a SQL statement to sql-snap server. The Promise will resolve with the result of the SQL statement

### send

```ts
send<T>(message: IMessage<string>): Promise<IMessage<T>>
```

Method to send a message to the client.

The *id* field of IMessage, will be filled in by the method.

> :warning: It's preferable to use the query method, when sending an SQL Statement.
