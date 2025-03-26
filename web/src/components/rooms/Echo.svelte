<script lang="ts">
  import type { StateUpdateMessage } from "@alicarti/shared";
  import {
    echoRoomActions,
    type ShoutPayload,
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
  });

  connection.addStateUpdater((message: StateUpdateMessage<EchoRoomState>) => {
    console.log(message);
    roomState = message.payload;
  });

  const shout = (e: SubmitEvent) => {
    e.preventDefault();
    connection.action<ShoutPayload>(room.id, echoRoomActions[0], {
      message: msg,
    });
    msg = "";
  };
</script>

<h1>Echo Room</h1>
<form onsubmit={shout}>
  <input type="text" bind:value={msg} />
</form>
<h2>Echos</h2>
<ul>
  {#each roomState.messages as message}
    <li>{message}</li>
  {/each}
</ul>
