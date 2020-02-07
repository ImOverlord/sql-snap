

import { Server } from 'ws'
import WebSocket = require("ws");
import * as http from 'http';
import { Snap } from './snap';
import { IMessage } from './Interface/IMessage';
import { ISnapServerConfig } from './Interface/ISnapServerConfig';

export class SnapServer {

    private server: Server;
    private snap: Snap;

    constructor(config: ISnapServerConfig) {
        this.server = new Server({
            port: config.port
        });
        this.snap = new Snap(config.dbConfig)
        this.snap.connect()
        .then(() => {
            console.log("Ready");
            this.server.on('connection', this.newSocket.bind(this));
        }).catch((error) => {
            console.log("Failed to connect");
            console.error(error);
        })
    }

    private newSocket(ws: WebSocket, request: http.IncomingMessage) {
        ws.on('message', this.onMessage.bind({snap: this.snap, ws}))
    }

    private onMessage(this: {snap: Snap, ws: WebSocket}, raw: string) {
        const message: IMessage = JSON.parse(raw);
        if (message.type === 'query') {
            this.snap.query(message.data)
            .then((result) => {
                this.ws.send(JSON.stringify({
                    type: 'response',
                    data: result,
                    id: message.id
                }));
            })
            .catch((error) => {
                this.ws.send(JSON.stringify({
                    type: 'error',
                    data: error,
                    id: message.id
                }));
            });
        } else {
            this.ws.send(JSON.stringify({
                type: 'error',
                data: new Error("Incorrect Message Type"),
                id: message.id
            }));
        }
    }
}
