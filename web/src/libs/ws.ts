export type WsEventListener = (ev: MessageEvent<any>) => void;
export type WsEvents = "message";
let ws: WebSocket | null = null;
let eventListeners: Record<WsEvents, WsEventListener | null> = {
  message: null,
};

export const connection = {
  open(onMessage: WsEventListener = console.log) {
    if (ws) return ws;

    ws = new WebSocket("http://localhost:3000");
    console.log(ws);
    ws.addEventListener("message", (m) => console.log(m));
    ws.addEventListener("message", onMessage);

    eventListeners.message = onMessage;
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
