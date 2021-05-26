/**
 * IMessage
 * @description Interface of how message are sent between Server and Client
 */
export interface IMessage<T = any> {
    id?: string;
    type: 'query' | 'response' | 'error';
    data: T;
}
