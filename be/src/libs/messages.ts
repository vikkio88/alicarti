import type { Client, WsMessage } from "@alicarti/shared";
import type { ServerWebSocket } from "bun";

export function toString<T>(message: WsMessage<T>): string {
  try {
    return JSON.stringify(message);
  } catch (err) {
    // TODO: maybe return false and do not send
    return JSON.stringify({ type: "error", error: err });
  }
}

export function sendStateUpdate<T>(ws: ServerWebSocket<Client>, state: T) {
  ws.send(toString({ type: "state_update", payload: state }));
}

export function sendMessage<T>(ws: ServerWebSocket<Client>, message: T) {
  ws.send(toString({ type: "message", payload: message }));
}
