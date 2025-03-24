import { RoomTypes, type Room, type RoomType } from "@alicarti/shared/rooms";
import type { Component, SvelteComponent } from "svelte";
import Echo from "../components/rooms/Echo.svelte";
import Chat from "../components/rooms/Echo.svelte";

export const componentsMap: Record<RoomType, Component<{ room: Room }, {}>> = {
  [RoomTypes.echo]: Echo,
  [RoomTypes.chat]: Chat,
};
