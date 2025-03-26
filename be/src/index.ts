import { parseMessage, setup, type Client } from "@alicarti/shared";
import { staticServe } from "./servers/static";
import { websocketUpgrade } from "./servers/upgrade";
import { Topic, TopicManager } from "./libs/Topic";
import { messageHandler, type ServerContext } from "./libs/messageHandler";
import { ClientsManager } from "./libs/ClientsManager";

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
};

export type WsServerConfig = {
  log: (...strings: string[]) => void;
};

const wsConfig: WsServerConfig = {
  log: (message: string) => console.log(`[server] ${Date.now()} - ${message}`),
};

const clientsManager = new ClientsManager();
const topicsManager = new TopicManager([new Topic("broadcast", false)]);
const broadcastTopic = topicsManager.byName("broadcast")!;
const ctx: ServerContext = {
  clients: clientsManager,
  topics: topicsManager,
  logger: wsConfig.log,
};

const server = Bun.serve<Client>({
  static: staticServe,
  websocket: {
    async message(ws, msg) {
      ctx.server = server;

      const message = parseMessage(msg as string);
      ctx.logger(`received message "${message.type}" from ${ws.data.socketId}`);
      messageHandler(ws, message, ctx);
    },
    async open(ws) {
      ctx.server = server;

      ctx.logger(`client connected: ${ws.data.socketId}`);
      ctx.clients.onConnect(ws);
      ctx.clients.joinTopic(broadcastTopic, ws);
      ws.send(setup({ ...ws.data }));
    },
    async close(ws) {
      ctx.server = server;
      
      ctx.logger(`client disconnected: ${ws.data.socketId}`);
      const topics = clientsManager.getClientTopics(ws);
      ctx.topics.getManyByName(topics).forEach((t) => {
        ctx.clients.leaveTopic(t, ws);
      });
      ctx.clients.onDisconnect(ws);
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
  server.stop(true);
  console.log("all done.");
  process.exit();
});
