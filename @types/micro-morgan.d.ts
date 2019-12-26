import { IncomingMessage, ServerResponse } from 'http';

declare module 'micro-morgan' {
    type RequestHandler = (req: IncomingMessage, res: ServerResponse) => any

    export function morgan(format: string): RequestHandler;

    export default morgan;
}
