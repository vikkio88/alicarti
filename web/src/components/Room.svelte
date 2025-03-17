<script lang="ts">
  import { Commands, type Room as JoinedRoom, type WsMessage } from "@alicarti/shared";
  import { connection } from "../libs/ws";
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
</script>

<h1>{room.roomId}</h1>
<button
  onclick={() =>
    connection.command(Commands.LEAVE_ROOM, { roomId: room.roomId })}
>
  Leave
</button>

<ul>
  {#each log as entry}
    <li>{entry}</li>
  {/each}
</ul>
