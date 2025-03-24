import { RoomTypes } from ".";
import { echoRoomActions, type EchoRoomConfig } from "./echo";

export interface ActionConfig {
  name: string;
}

export interface RoomConfig<TState> {
  initialState: TState;
  availableActions: string[];
}

export const roomConfigGenerators = {
  [RoomTypes.echo]: (): EchoRoomConfig => {
    return {
      initialState: {
        messages: [],
        clients: 0,
      },
      availableActions: [...echoRoomActions],
    };
  },
};
