import { RoomTypes } from "@alicarti/shared/rooms";
import type { TopicConfig } from "./libs/Topic";

export const BROADCAST_TOPIC_NAME = "broadcast";
export const BROADCAST_TOPIC_CONFIG: TopicConfig = {
  name: BROADCAST_TOPIC_NAME,
  type: RoomTypes.broadcast,
  admin: "server",
  options: {
    clientsCanPublish: false,
  },
};
export const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
};
