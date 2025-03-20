<script lang="ts">
  import {
    Commands,
    RoomTypes,
    type Room as JoinedRoom,
    type WsMessage,
  } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  import { componentsMap } from "../config/config.svelte";

  type Props = {
    room: JoinedRoom;
  };
  let { room }: Props = $props();

  let log: string[] = $state([]);

  type RoomLog = {
    sender: string;
    entry: string;
  };

  connection.addMessageHandler((message: WsMessage<any>) => {
    if (message.type === "state_update") {
      const logEntry = message.payload as RoomLog;
      log.push(`${logEntry.sender} : ${logEntry.entry}`);
    }
  });

  let Room = componentsMap[room.type] || componentsMap[RoomTypes.echo];
</script>

<h1>{room.roomId}</h1>
<button
  onclick={() =>
    connection.command(Commands.LEAVE_ROOM, { roomId: room.roomId })}
>
  Leave
</button>

<Room />
<ul>
  {#each log as entry}
    <li>{entry}</li>
  {/each}
</ul>
