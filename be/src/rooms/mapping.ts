import { RoomTypes } from "@alicarti/shared/rooms";
import { actionsHandler as echo } from "./echo";

export const roomLogic = {
  [RoomTypes.echo]: echo,
};
