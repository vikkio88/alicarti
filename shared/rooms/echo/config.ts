export type EchoRoomState = {
  messages: string[];
};

export const echoRoomActions = ["shout"] as const;
export type EchoRoomActions = (typeof echoRoomActions)[number];

export type ShoutPayload = {
  message: string;
};
