export const MessageTypes = {
  setup: "setup",
  error: "error",
  unknown: "unknown",

  command: "command",
  command_result: "command_result",

  state_update: "state_update",
  message: "message",
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

// Define message mapping
export type WsMessageMap<T> = {
  [MessageTypes.setup]: SetupMessage<T>;
  [MessageTypes.error]: ErrorMessage;
  [MessageTypes.command]: CommandMessage<T>;
  [MessageTypes.command_result]: CommandResultMessage<T>;
  [MessageTypes.state_update]: StateUpdateMessage<T>;
  [MessageTypes.message]: GenericMessage<T>;
  [MessageTypes.unknown]: UnknownMessage;
};

// Main WsMessage type using the mapped structure
export type WsMessage<T> = WsMessageMap<T>[MessageType];

// Individual message types using `MessageTypes`
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

export type CommandInfo = {
  name: string;
  description: string;
};

export const Commands = {
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
} as const;

export type CommandName = (typeof Commands)[keyof typeof Commands];

export type Client = {
  createdAt: number;
  socketId: string;
  availableCommands: CommandInfo[];
};
