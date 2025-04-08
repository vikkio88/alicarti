import { RoomTypes, type Room, type RoomType } from "@alicarti/shared/rooms";
import type { Component } from "svelte";
import Echo from "../components/rooms/Echo.svelte";
import Chat from "../components/rooms/Chat.svelte";
import type { RoomProps } from "../components/rooms/props";
import Rps from "../components/rooms/rockPaperScissor/Rps.svelte";

export const componentsMap: Record<RoomType, Component<RoomProps<any>, {}>> = {
  [RoomTypes.echo]: Echo,
  [RoomTypes.chat]: Chat,
  // Games
  [RoomTypes.rockPaperScissor]: Rps,

  // tests
  [RoomTypes.broadcast]: Echo,
};
