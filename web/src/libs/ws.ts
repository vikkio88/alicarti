import type { Client, WsMessage } from "@alicarti/shared";

export type WsEventListener = (ev: MessageEvent<any>) => void;
export type WsEvents = "message";
let ws: WebSocket | null = null;
let connectionInfo: Client | null = null;
let eventListeners: Record<WsEvents, WsEventListener | null> = {
  message: null,
};

export const connection = {
  info() {
    return connectionInfo;
  },
  open(onMessage: WsEventListener = console.log) {
    if (ws) return ws;

    ws = new WebSocket("http://localhost:3000");
    ws.addEventListener("message", (e) => {
      const message = parseMessage<Client>(e.data);
      if (isError(message)) {
        ws?.close();
        return;
      }

      connectionInfo = message.payload;
      if (ws) {
        ws.onmessage = onMessage;
        eventListeners.message = onMessage;
      }
    });

    return ws;
  },
  close() {
    if (!ws) return;

    ws.close();
  },
  message(msg: string) {
    ws?.send(msg);
  },
  replaceEventListener(event: WsEvents, listener: WsEventListener) {
    if (!ws || !eventListeners[event]) {
      //TODO: maybe add a bool return
      return;
    }

    ws.removeEventListener(event, eventListeners[event]);
    ws.addEventListener(event, listener);
  },
};

function parseMessage<T>(msg: string): WsMessage<T> {
  try {
    return JSON.parse(msg) as WsMessage<T>;
  } catch (err) {
    return { type: "error", error: `Could not parse message` };
  }
}

function isError(
  message: WsMessage<any>
): message is { type: "error"; error: string } {
  return message.type === "error";
}
