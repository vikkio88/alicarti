export interface ActionConfig {
  name: string;
}

export interface RoomConfig<TState> {
  initialState: TState;
  availableActions: string[];
}
