import fs = require("fs");
import { promisify } from 'util';
import { IDatabaseConfig } from './Interface/IDatabaseConfig';
import { AbstractDialect } from './dialect/abstract';
import { IQueryResult } from './Interface/IQueryResult';

const readFile = promisify(fs.readFile);
export class Snap {

    private db: AbstractDialect;
    private dbConfig: IDatabaseConfig;

    constructor(
        config: string | IDatabaseConfig
    ) {
        if (typeof config === "string") {
            const url = new URL(config);
            const dialect = url.protocol.replace(/:$/, '');
            const host = url.hostname;
            const database = url.pathname.replace(/^\//, '');
            this.dbConfig = {
                host,
                database,
                dialect: dialect as any,
            }
            if (url.port)
                this.dbConfig.port = parseInt(url.port);
            if (url.username)
                this.dbConfig.username = url.username;
            if (url.password)
                this.dbConfig.password = url.password;
        } else {
            this.dbConfig = config;
        }
        this.dbConfig.dialect = this.parseDialect(this.dbConfig.dialect);
        switch (this.dbConfig.dialect) {
        case 'pg':
            this.db = new (require("./dialect/pg").default)(this.dbConfig)
            break;
        case 'sqlite':
            this.db = new (require("./dialect/sqlite").default)(this.dbConfig);
            break;
        default:
            throw new Error(`${this.dbConfig.dialect}: is not supported`);
        }
    }

    private parseDialect(dialect: string): string {
        const dialectNames = {
            'pg': ['postgres', 'pg'],
            'sqlite': ['sqlite', 'sqlite3']
        }
        for (const key of Object.keys(dialectNames)) {
            if (dialectNames[key].includes(dialect))
                return key
        }
        throw new Error("Unknown Dialect");
    }

    public connect(): Promise<void> {
        return this.db.connect();
    }

    public query<T extends object = any>(statement: string): Promise<IQueryResult<T>> {
        return this.db.query(statement);
    }

    public runFile(filePath: string): Promise<any> {
        return readFile(filePath)
        .then((content) => {
            return this.db.query(content.toString('utf-8'));
        });
    }

    public disconnect(): Promise<void> {
        return this.db.disconnect();
    }
}
