import { Client, ClientConfig, QueryResult } from 'pg'
import fs = require("fs");
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export class Snap {

    private db: Client;

    constructor(
        private config: ClientConfig
    ) {
        this.db = new Client(this.config);
    }

    public connect(): Promise<void> {
        return this.db.connect();
    }

    public query<T extends object = any>(statement: string): Promise<QueryResult<T>> {
        return this.db.query(statement);
    }

    public runFile(filePath: string): Promise<any> {
        return readFile(filePath)
        .then((content) => {
            return this.db.query(content.toString('utf-8'));
        });
    }

    public disconnect(): Promise<void> {
        return this.db.end();
    }
}