import { IDatabaseConfig } from "../../Interface/IDatabaseConfig";
import { AbstractDialect } from "../abstract";

import { Database } from 'sqlite3';
import { IQueryResult } from "../../Interface/IQueryResult";

export default class PgDialect implements AbstractDialect {

    private client: Database;

    constructor(private config: IDatabaseConfig) { }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new Database(this.config.host, (err) => {
                if (err) reject(err)
                else resolve();
            })
        })
    }

    public query<T extends object = any>(statement: string): Promise<IQueryResult<T>> {
        return new Promise((resolve, reject) => {
            this.client.all(statement, (error, rows) => {
                if (error) return reject(error);
                resolve({
                    rows
                })
            })
        });
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.close((error) => {
                if (error) return reject(error)
                resolve();
            })
        });
    }

}
