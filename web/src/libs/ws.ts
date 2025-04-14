import {
  cmd,
  parseMessage,
  isErrorMessage,
  isSetupMessage,
  type Client,
  type WsMessage,
  type WsEvents,
  type StateUpdateMessage,
  action as act,
} from "@alicarti/shared";

type Cb = () => void;

const { hostname, port: webPort } = window.location;
const isDevMode = import.meta.env.MODE === "development";
const port = isDevMode ? 3000 : webPort;
const WS_SERVER_URL = `http://${hostname}:${port}`;

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
  open(callback: Cb = () => {}) {
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
  onClose(callback: Cb | null = null) {
    ws?.addEventListener("close", () => {
      ws = null;
      if (callback) callback();
    });
  },
  message(msg: string) {
    ws?.send(msg);
  },
  action<T>(roomId: string, action: string, data?: T) {
    ws?.send(act({ roomId, action, data }));
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
  addStateUpdater<T>(handler: (m: StateUpdateMessage<T>) => void) {
    //TODO: cleanup message listener after leaving room
    ws?.addEventListener("message", (ev) => {
      const message = parseMessage(ev.data) as WsMessage<T>;
      if (message.type !== "state_update") {
        return;
      }
      handler(message);
    });
  },
};
