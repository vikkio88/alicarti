<script lang="ts">
  import {
    Commands,
    RoomTypes,
    type Client,
    type Room as JoinedRoom,
    type WsMessage,
  } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  import { componentsMap } from "../config/config.svelte";

  type Props = {
    room: JoinedRoom;
    self: Client;
  };
  let { room, self }: Props = $props();
  let Room = componentsMap[room.type] || componentsMap[RoomTypes.echo];
</script>

<h1>{self.socketId} @ {room.id}</h1>
<button
  onclick={() =>
    connection.command(Commands.LEAVE_ROOM, { roomId: room.id })}
>
  Leave
</button>

<Room />
