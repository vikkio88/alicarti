import {
  MessageTypes,
  type Client,
  type CommandMessage,
  type CommandPayload,
  type CommandResultMessage,
  type ErrorMessage,
  type SetupMessage,
  type SetupPayload,
  type WsMessage,
} from "./index";

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

export function parseMessage<T>(msg: string): WsMessage<T> {
  try {
    return JSON.parse(msg) as WsMessage<T>;
  } catch (err) {
    return { type: "error", error: `Could not parse message` };
  }
}

export function isErrorMessage(
  message: WsMessage<any>
): message is ErrorMessage {
  return message.type === MessageTypes.error;
}

export function isSetupMessage<T>(
  message: WsMessage<T>
): message is SetupMessage<T> {
  return message.type === MessageTypes.setup;
}

export function isCommandMessage<T>(
  message: WsMessage<T>
): message is CommandMessage<T> {
  return message.type === MessageTypes.command;
}

export function isCommandResultMessage<T>(
  message: WsMessage<T>
): message is CommandResultMessage<T> {
  return message.type === MessageTypes.command_result;
}
