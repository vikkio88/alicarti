<script lang="ts">
  import { Commands, type WsMessage } from "@alicarti/shared";
  import { connection } from "../libs/ws";
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

  let { roomId } = $props();
</script>

<h1>{roomId}</h1>
<button onclick={() => connection.command(Commands.LEAVE_ROOM, { roomId })}>
  Leave
</button>

<ul>
  {#each log as entry}
    <li>{entry}</li>
  {/each}
</ul>
