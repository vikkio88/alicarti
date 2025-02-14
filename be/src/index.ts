import type { Client } from "@alicarti/shared";
import { staticServe } from "./servers/static";
import { websocketServe, websocketUpgrade } from "./servers/websocket";

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
};

const server = Bun.serve<Client>({
  static: staticServe,
  websocket: websocketServe,

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
