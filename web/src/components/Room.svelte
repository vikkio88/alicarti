<script lang="ts">
  import { Commands, type Client } from "@alicarti/shared";
  import { RoomTypes, type Room as JoinedRoom } from "@alicarti/shared/rooms";
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
  onclick={() => connection.command(Commands.LEAVE_ROOM, { roomId: room.id })}
>
  Leave
</button>

<Room {room} />
