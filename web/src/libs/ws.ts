import type { Client, WsMessage } from "@alicarti/shared";

export type WsEventListener = (ev: MessageEvent<any>) => void;
export type WsEvents = "message";
let eventListeners: Record<WsEvents, WsEventListener | null> = {
  message: null,
};
let ws: WebSocket | null = null;
let connectionInfo: Client | null = null;

export const setupHandler = (e: MessageEvent) => {
  const message = parseMessage<Client>(e.data);
  if (isError(message)) {
    ws?.close();
    return;
  }

  if (message.type === "setup") {
    connectionInfo = message.payload;
  }
};

export const connection = {
  info() {
    return connectionInfo;
  },
  open() {
    if (ws) return ws;

    ws = new WebSocket("http://localhost:3000");

    ws.addEventListener("message", setupHandler);
    eventListeners.message = setupHandler;

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
    eventListeners[event] = listener;
  },
  setMessageHandler<T>(handler: (m: WsMessage<T>) => void) {
    this.replaceEventListener("message", (ev) => {
      const message = parseMessage(ev.data) as WsMessage<T>;
      handler(message);
    });
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
