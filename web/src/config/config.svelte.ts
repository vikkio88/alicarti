import { RoomTypes, type RoomType } from "@alicarti/shared";
import type { Component } from "svelte";
import Echo from "../components/rooms/Echo.svelte";
import Chat from "../components/rooms/Echo.svelte";

export const componentsMap: Record<RoomType, Component> = {
  [RoomTypes.echo]: Echo,
  [RoomTypes.chat]: Chat,
};
