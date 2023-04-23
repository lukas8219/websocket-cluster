import { WebSocketServer as WsServer } from "ws";

export const WebSocketServer = new WsServer({ port: process.env.WS_PORT || 8000 });