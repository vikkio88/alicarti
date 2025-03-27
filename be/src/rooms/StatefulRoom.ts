import type { ActionPayload, Client } from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../servers/websocket";

export interface StatefulRoom<TState> {
  state: TState;
  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): TState;
}
