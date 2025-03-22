import { RoomTypes } from ".";

export type ActionConfig = {
  name: string;
  payloadGenerator: (params: any) => any;
};

export interface RoomConfig<T> {
  initialState: T;
  availableActions: Record<string, ActionConfig>;
}

export type EchoRoomState = {
  messages: string[];
  clients: number;
};

export interface EchoRoomConfig extends RoomConfig<EchoRoomState> {
  initialState: EchoRoomState;
}

export const roomConfigGenerators = {
  [RoomTypes.echo]: (): EchoRoomConfig => {
    return {
      initialState: {
        messages: [],
        clients: 0,
      },
      availableActions: {
        shout: {
          name: "shout",
          payloadGenerator: (value: string) => value,
        },
      },
    };
  },
};
