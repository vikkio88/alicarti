const MessageTypes = {
  setup: "setup",
  error: "error",
  unknown: "unknown",

  command: "command",
  command_result: "command_result",

  state_update: "state_update",
  message: "message",
} as const;

export type MessageType = keyof typeof MessageTypes;

export type WsMessage<T> =
  | {
      type: MessageType;
      payload: T;
    }
  | { type: "setup"; payload: SetupPayload<T> }
  | { type: "command"; payload: CommandPayload<T> }
  | { type: "command_result"; payload: CommandPayload<T> }
  | {
      type: "error";
      error: string;
    };

export type SetupPayload<T> = {
  setup: Client;
  initialState?: T;
};

export type CommandPayload<T> = {
  command: string;
  success?: boolean;
  payload?: T;
};

type Command = {
  name: string;
  description: string;
};

export type Client = {
  createdAt: number;
  socketId: string;
};
