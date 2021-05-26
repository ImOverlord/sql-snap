import { IDatabaseConfig } from "../../Interface/IDatabaseConfig";
import { AbstractDialect } from "../abstract";

import { Client } from 'pg';
import { IQueryResult } from "../../Interface/IQueryResult";

export default class PgDialect implements AbstractDialect {

    private client: Client;

    constructor(private config: IDatabaseConfig) {
        this.client = new Client({
            user: this.config.username,
            host: this.config.host,
            password: this.config.password,
            port: this.config.port,
            database: this.config.database
        });
    }

    public connect(): Promise<void> {
        return this.client.connect();
    }

    public query<T extends object = any>(statement: string): Promise<IQueryResult<T>> {
        return this.client.query(statement)
        .then((result) => {
            return {
                rows: result.rows
            };
        })
    }

    public disconnect(): Promise<void> {
        return this.client.end();
    }

}
