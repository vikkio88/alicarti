import type { Client } from "./Client";

export const MessageTypes = {
  setup: "setup",
  error: "error",
  unknown: "unknown",

  // Allows websocket level commands
  command: "command",
  command_result: "command_result",

  // Tracks the state of a room/topic
  state_update: "state_update",
  // This triggers a mutation in room/topic state
  action: "action",

  // Generic message
  message: "message",
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

export type WsMessageMap<T> = {
  [MessageTypes.setup]: SetupMessage<T>;
  [MessageTypes.error]: ErrorMessage;

  [MessageTypes.command]: CommandMessage<T>;
  [MessageTypes.command_result]: CommandResultMessage<T>;

  [MessageTypes.action]: ActionMessage<T>;
  [MessageTypes.state_update]: StateUpdateMessage<T>;

  [MessageTypes.message]: GenericMessage<T>;
  [MessageTypes.unknown]: UnknownMessage;
};

export type WsMessage<T> = WsMessageMap<T>[MessageType];

export type GenericMessage<T> = {
  type: typeof MessageTypes.message;
  payload: T;
};

export type SetupMessage<T> = {
  type: typeof MessageTypes.setup;
  payload: SetupPayload<T>;
};

export type CommandMessage<T> = {
  type: typeof MessageTypes.command;
  payload: CommandPayload<T>;
};

export type ActionMessage<T> = {
  type: typeof MessageTypes.action;
  payload: T;
};

export type CommandResultMessage<T> = {
  type: typeof MessageTypes.command_result;
  payload: CommandPayload<T>;
};

export type StateUpdateMessage<T> = {
  type: typeof MessageTypes.state_update;
  payload: T;
};

export type ErrorMessage = {
  type: typeof MessageTypes.error;
  error: string;
};

export type UnknownMessage = {
  type: typeof MessageTypes.unknown;
};

export type SetupPayload<T> = {
  setup: Client;
  initialState?: T;
};

export type CommandPayload<T> = {
  command: string;
  success?: boolean;
  data?: T;
};

export type WsEvents = "message" | "close" | "error" | "open";
