export interface IDatabaseConfig {
    host: string;
    port?: number;
    username?: string;
    password?: string;
    database: string;
    dialect: 'pg' | 'sqlite' | string;
}
