import { IDatabaseConfig } from "../../Interface/IDatabaseConfig";
import { IQueryResult } from "../../Interface/IQueryResult";

export abstract class AbstractDialect {

    constructor(config: IDatabaseConfig) { }

    public abstract connect(): Promise<void>;

    public abstract query<T extends object = any>(statement: string): Promise<IQueryResult<T>>;

    public abstract disconnect(): Promise<void>;

}
