<script lang="ts">
  import { Commands, type Client } from "@alicarti/shared";
  import { RoomTypes, type Room as JoinedRoom } from "@alicarti/shared/rooms";
  import { connection } from "../libs/ws";
  import { componentsMap } from "../config/config.svelte";

  type Props = {
    room: JoinedRoom;
    self: Client;
    initialState?: unknown;
  };
  let { room, self, initialState }: Props = $props();
  let Room = componentsMap[room.type] || componentsMap[RoomTypes.echo];
</script>

<div class="topLeft">
  <button
    onclick={() => connection.command(Commands.LEAVE_ROOM, { roomId: room.id })}
  >
    Leave
  </button>
</div>

<Room {room} {self} {initialState} />

<style>
  .topLeft {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
