import { RoomTypes, type Room, type RoomType } from "@alicarti/shared/rooms";
import type { Component } from "svelte";
import Echo from "../components/rooms/Echo.svelte";
import Chat from "../components/rooms/Chat.svelte";
import type { RoomProps } from "../components/rooms/props";

export const componentsMap: Record<RoomType, Component<RoomProps<any>, {}>> = {
  [RoomTypes.echo]: Echo,
  [RoomTypes.chat]: Chat,
  [RoomTypes.broadcast]: Echo,
};
