import {
  cmd,
  parseMessage,
  isErrorMessage,
  isSetupMessage,
  type Client,
  type WsMessage,
  type WsEvents,
} from "@alicarti/shared";

const WS_SERVER_URL = "http://localhost:3000";

export type WsEventListener = (
  ev: MessageEvent<any> | Event | CloseEvent
) => void;
let ws: WebSocket | null = null;
let connectionInfo: Client | null = null;
let initialState: any = undefined;

export const setupHandler = (e: MessageEvent) => {
  const message = parseMessage(e.data);
  if (isErrorMessage(message)) {
    ws?.close();
    return;
  }

  if (isSetupMessage(message)) {
    connectionInfo = message.payload.setup;
    initialState = message.payload.initialState;
  }
};

export const connection = {
  info() {
    return { connection: connectionInfo, initialState };
  },
  open(callback: () => void = () => {}) {
    if (ws) return ws;

    ws = new WebSocket(WS_SERVER_URL);
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
  command<T>(name: string, data?: T) {
    ws?.send(cmd({ command: name, data }));
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
      const message = parseMessage(
        (ev as MessageEvent<any>).data
      ) as WsMessage<T>;
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
