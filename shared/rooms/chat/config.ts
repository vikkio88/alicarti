import type { RoomConfig } from "../configs";

export type ChatMessage = {
  message: string;
  author: string;
  timestamp: number;
};

export type ChatRoomState = {
  messages: ChatMessage[];
};

export const chatRoomActions = ["send_message"] as const;
export type ChatRoomActions = (typeof chatRoomActions)[number];

export type SendMessagePayload = {
  message: string;
};
