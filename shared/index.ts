const MessageTypes = {
  setup: "setup",
  error: "error",
  unknown: "unknown",
  
  state_update: "state_update",
  message: "message",
} as const;

export type MessageType = keyof typeof MessageTypes;

export type WsMessage<T> = {
  type: MessageType;
  payload: T;
} | {
  type: "error";
  error: string;
};


export type Client = {
  createdAt: number;
  socketId: string;
};