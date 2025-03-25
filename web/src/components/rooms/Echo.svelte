<script lang="ts">
  import type { StateUpdateMessage } from "@alicarti/shared";
  import {
    echoRoomActions,
    type EchoRoomState,
  } from "@alicarti/shared/rooms/echo/config";
  import { connection } from "../../libs/ws";
  import type { Room } from "@alicarti/shared/rooms";

  type Props = {
    room: Room;
  };

  let { room }: Props = $props();

  let msg: string = $state("");
  let roomState: EchoRoomState = $state({
    messages: [] as string[],
    clients: 0,
  });

  connection.addStateUpdater((message: StateUpdateMessage<EchoRoomState>) => {
    roomState = message.payload;
  });

  const shout = (e: SubmitEvent) => {
    e.preventDefault();
    connection.action(room.id, echoRoomActions[0], { msg });
    msg = "";
  };
</script>

<h1>Echo Room</h1>
<h3>Clients: {roomState.clients}</h3>
<ul>
  {#each roomState.messages as message}
    <li>{message}</li>
  {/each}
</ul>

<form onsubmit={shout}>
  <input type="text" bind:value={msg} />
</form>
