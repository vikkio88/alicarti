import type { WsMessage } from "@alicarti/shared";

export function toString<T>(message: WsMessage<T>): string {
  try {
    return JSON.stringify(message);
  } catch (err) {
    // TODO: maybe return false and do not send
    return JSON.stringify({ type: "error", error: err });
  }
}

export function sendStateUpdate<T>(ws: WebSocket, state: T) {
  ws.send(toString({ type: "state_update", payload: state }));
}
