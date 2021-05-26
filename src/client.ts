import WebSocket from 'ws'
import { IMessage } from './Interface/IMessage';
import { EventEmitter } from 'events';
import { IQueryResult } from './Interface/IQueryResult';

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
            const id = Date.now().toString(); /** @todo Make it more percise */
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

    public query<T>(statement: string): Promise<IMessage<IQueryResult<T>>> {
        return this.send<IQueryResult<T>>({
            type: 'query',
            data: statement
        });
    }

    private receive(raw: string): void {
        const message: IMessage<IQueryResult<any>> = JSON.parse(raw);
        this.eventManager.emit(`message-${message.id}`, message);
    }
}
