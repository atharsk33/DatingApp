export interface Group {
    name: String;
    Connections: Connection[]
}

interface Connection {
    connectionId: string;
    username:string
}