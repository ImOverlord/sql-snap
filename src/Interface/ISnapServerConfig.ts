import { IDatabaseConfig } from './IDatabaseConfig';
export interface ISnapServerConfig {
    /** port {number}: WebSocket Port to be used */
    port: number;
    /** db {string | IDatabaseConfig}: Config to connect to databse */
    db: string | IDatabaseConfig;
}
