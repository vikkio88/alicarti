<script lang="ts">
  import type { StateUpdateMessage } from "@alicarti/shared";
  import {
    echoRoomActions,
    type ShoutPayload,
    type EchoRoomState,
  } from "@alicarti/shared/rooms/echo/config";
  import { connection } from "../../libs/ws";
  import type { RoomProps } from "./props";
  let { room, initialState }: RoomProps<EchoRoomState> = $props();

  let msg: string = $state("");
  let roomState = $state({
    ...initialState,
  });

  connection.addStateUpdater((message: StateUpdateMessage<EchoRoomState>) => {
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

<main class="c">
  <h1>Echo Room</h1>
  <form onsubmit={shout}>
    <input type="text" bind:value={msg} placeholder="Message to echo" />
  </form>
  <h2>Echos</h2>
  <ul>
    {#each roomState.messages as message}
      <li>{message}</li>
    {/each}
  </ul>
</main>

<style>
  input {
    width: 100%;
  }
</style>
