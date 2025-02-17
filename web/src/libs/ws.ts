import type { Client, SetupPayload, WsMessage } from "@alicarti/shared";

export type WsEventListener = (ev: MessageEvent<any>) => void;
export type WsEvents = "message";
let ws: WebSocket | null = null;
let connectionInfo: Client | null = null;
let initialState: any = undefined;

export const setupHandler = (e: MessageEvent) => {
  const message = parseMessage(e.data);
  if (isError(message)) {
    ws?.close();
    return;
  }

  if (isSetup(message)) {
    connectionInfo = message.payload.setup;
    initialState = message.payload.initialState;
  }
};

export const connection = {
  info() {
    return { connectionInfo, initialState };
  },
  open(callback: () => void = () => {}) {
    if (ws) return ws;

    ws = new WebSocket("http://localhost:3000");
    const setup = (ev: MessageEvent<any>) => {
      setupHandler(ev);
      callback();
    };
    ws.addEventListener("message", setup);
    return ws;
  },
  close() {
    if (!ws) return;

    ws.close();
    ws = null;
  },
  message(msg: string) {
    ws?.send(msg);
  },
  replaceEventListener(event: WsEvents, listener: WsEventListener) {
    if (!ws) {
      //TODO: maybe add a bool return
      return;
    }

    ws.onmessage = null;
    ws.addEventListener(event, listener);
  },
  setMessageHandler<T>(handler: (m: WsMessage<T>) => void) {
    this.replaceEventListener("message", (ev) => {
      const message = parseMessage(ev.data) as WsMessage<T>;
      handler(message);
    });
  },
  addMessageHandler<T>(handler: (m: WsMessage<T>) => void) {
    ws?.addEventListener("message", (ev) => {
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

function isSetup(
  message: WsMessage<any>
): message is { type: "setup"; payload: SetupPayload<any> } {
  return message.type === "setup";
}
