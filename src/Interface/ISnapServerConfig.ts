import { ClientConfig } from 'pg';

export interface ISnapServerConfig {
    port: number;
    dbConfig: ClientConfig;
}