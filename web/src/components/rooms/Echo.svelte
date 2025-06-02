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

<main>
  <article>
    <h2>Echo Room</h2>
    <form onsubmit={shout}>
      <div class="field border">
        <label for="message">Message to echo</label>
        <input type="text" bind:value={msg} name="message" autocomplete="off" />
      </div>
    </form>
    <h3>Previous Echoes</h3>
    <ul>
      {#each roomState.messages as message}
        <li>{message}</li>
      {/each}
    </ul>
  </article>
</main>

<style>
  input {
    width: 100%;
  }
</style>
