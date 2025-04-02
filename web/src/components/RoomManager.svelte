<script lang="ts">
  import { type Client } from "@alicarti/shared";
  import { RoomTypes, type Room as JoinedRoom } from "@alicarti/shared/rooms";
  import { componentsMap } from "../config/config.svelte";

  type Props = {
    room: JoinedRoom;
    self: Client;
    initialState?: unknown;
  };
  let { room, self, initialState }: Props = $props();
  let Room = componentsMap[room.type] || componentsMap[RoomTypes.echo];
</script>

<Room {room} {self} {initialState} />
