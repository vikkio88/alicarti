import type { Client, CommandPayload, WsMessage } from "./index";

export function toString<T>(message: WsMessage<T>): string {
  try {
    return JSON.stringify(message);
  } catch (err) {
    // TODO: maybe return false and do not send
    return JSON.stringify({ type: "error", error: err });
  }
}

export function setup<T>(setup: Client, initialState: T) {
  return toString({
    type: "setup",
    payload: { setup, initialState },
  });
}

export function stateUpdate<T>(state: T) {
  return toString({ type: "state_update", payload: state });
}

export function message<T>(payload: T) {
  return toString({ type: "message", payload });
}

export function cmd<T>(payload: CommandPayload<T>) {
  return toString({ type: "command", payload });
}

export function cmdResult<T>(payload: CommandPayload<T>) {
  return toString({ type: "command_result", payload });
}
