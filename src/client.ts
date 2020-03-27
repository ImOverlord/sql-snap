import WebSocket from 'ws'
import { IMessage } from './Interface/IMessage';
import { EventEmitter } from 'events';
import { QueryResult } from 'pg';

export class SnapClient {

    private client: WebSocket;
    private eventManager: EventEmitter

    constructor(
        private url: string
    ) {
        this.eventManager = new EventEmitter;
    }

    public connect(): Promise<void> {
        return new Promise((resolve) => {
            this.client = new WebSocket(this.url);
            this.client.on('message', this.receive.bind(this));
            this.client.on('open', () => {
                resolve();
            });
        });
    }

    public send<T>(message: IMessage<string>): Promise<IMessage<T>> {
        return new Promise((resolve, reject) => {
            const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            message.id = id;
            this.client.send(JSON.stringify(message));
            this.eventManager.once(`message-${id}`, (message: IMessage<T>) => {
                if (message.type === 'error')
                    reject(message);
                else
                    resolve(message);
            });
        })
    }

    public query<T>(statement: string): Promise<IMessage<QueryResult<T>>> {
        return this.send<QueryResult<T>>({
            type: 'query',
            data: statement
        });
    }

    private receive(raw: string): void {
        const message: IMessage<QueryResult<any>> = JSON.parse(raw);
        this.eventManager.emit(`message-${message.id}`, message);
    }
}

// const sqlFile =
// `
// SET SCHEMA 'test';
// INSERT INTO "Users" (email, password, "hashMail") VALUES ('test1@mail.com', 'password', 'mail');
// INSERT INTO "Users" (email, password, "hashMail") VALUES ('test2@mail.com', 'password', 'mail');
// SELECT * FROM "Users"
// SELECT * FROM "UserInfo";
// `

// const client = new SnapClient('ws://127.0.0.1:3001');

// client.connect()
// .then(() => {
//     client.send({
//         type: 'query',
//         data: sqlFile
//     }).then((resp) => {
//         console.log('SQL File');
//         console.log(resp);
//     })
//     client.send({
//         type: 'query',
//         data: `SELECT * FROM "test"."Users" LIMIT 1000`
//     }).then((resp) => {
//         console.log('SELECT');
//         console.log(resp);
//     })
// })


// const client = new WebSocket('ws://127.0.0.1:3001');



// client.on('open', function open() {
//     client.send("Hello #orld");
// });

// client.on('message', (message) => {
//     console.log(JSON.parse(message.toString()));
// })