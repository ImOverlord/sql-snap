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

    public connect() {
        return new Promise((resolve, reject) => {
            this.client = new WebSocket(this.url);
            this.client.on('message', this.receive.bind(this));
            this.client.on('open', () => {
                resolve();
            });
        });
    }

    public send<T>(message: IMessage<string>): Promise<IMessage<QueryResult<T>>> {
        return new Promise((resolve, reject) => {
            const id = Date.now().toString();
            message.id = id;
            this.client.send(JSON.stringify(message));
            this.eventManager.once(`message-${id}`, (message: IMessage<QueryResult<T>>) => {
                if (message.type === 'error')
                    reject(message);
                else
                    resolve(message);
            });
        })
    }

    public query(statement: string) {
        return this.send({
            type: 'query',
            data: statement
        });
    }

    private receive(raw: string) {
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