const MessageTypes = {
  setup: "setup",
  message: "",
} as const;

export type MessageType = keyof typeof MessageTypes;

export type WsMessage = {
  type: MessageType;
  payload: any;
};


export type Client = {
  createdAt: number;
  socketId: string;
};