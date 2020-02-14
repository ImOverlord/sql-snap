export interface IMessage<T = any> {
    id?: string;
    type: 'query' | 'response' | 'error';
    data: T;
}
