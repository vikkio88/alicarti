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

export function setup<T, T1>(setup: T, initialState: T1) {
  return toString({ type: "setup", payload: { setup, initialState } });
}

export function stateUpdate<T>(state: T) {
  return toString({ type: "state_update", payload: state });
}

export function message<T>(message: T) {
  return toString({ type: "message", payload: message });
}
