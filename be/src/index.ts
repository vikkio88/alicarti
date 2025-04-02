import { type Client } from "@alicarti/shared";
import { staticServe } from "./servers/static";
import { websocketUpgrade } from "./servers/upgrade";
import { Topic, TopicManager } from "./libs/Topic";
import { ClientsManager } from "./libs/ClientsManager";
import {
  onClose,
  onMessage,
  onOpen,
  type ServerContext,
} from "./servers/websocket";
import {
  BROADCAST_TOPIC_CONFIG,
  BROADCAST_TOPIC_NAME,
  CORS_HEADERS,
} from "./const";

export type WsServerConfig = {
  log: (...strings: string[]) => void;
};

const wsConfig: WsServerConfig = {
  log: (message: string) => console.log(`[server] ${Date.now()} - ${message}`),
};

const clientsManager = new ClientsManager();
const topicsManager = new TopicManager([new Topic(BROADCAST_TOPIC_CONFIG)]);
const broadcastTopic = topicsManager.byName(BROADCAST_TOPIC_NAME)!;
const ctx: ServerContext = {
  clients: clientsManager,
  topics: topicsManager,
  logger: wsConfig.log,
};

const server = Bun.serve<Client, typeof staticServe>({
  static: staticServe,
  websocket: {
    async message(ws, msg) {
      ctx.server = server;
      onMessage(ws, msg, ctx);
    },
    async open(ws) {
      ctx.server = server;
      onOpen(ws, ctx, broadcastTopic);
    },
    async close(ws) {
      ctx.server = server;
      onClose(ws, ctx);
    },
  },
  async fetch(req, server) {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      const res = new Response("Departed", CORS_HEADERS);
      return res;
    }

    // WS Upgrade
    server.upgrade(req, websocketUpgrade());

    // fallback
    return new Response("404!");
  },
});

console.log(`Running on :${server.port}`);
process.on("SIGINT", () => {
  console.log("\nReceived SIGINT\nrunning cleanup...");
  // TODO: ctx cleanup?
  server.stop(true);
  console.log("all done.");
  process.exit();
});
