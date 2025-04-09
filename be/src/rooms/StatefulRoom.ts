import type { ActionPayload, Client } from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../servers/websocket";

export interface StatefulRoom<TState> {
  state: TState;
  topicName: string;
  hasSetup: boolean;

  setup(config: unknown): void;

  onJoin(client: Client, ctx: ServerContext): void;
  onLeave(client: Client, ctx: ServerContext): void;

  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): TState;
}
