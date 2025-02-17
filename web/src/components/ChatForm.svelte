<script lang="ts">
  import type { WsMessage } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  type Props = {
    onClose: () => void;
  };

  let { onClose }: Props = $props();
  let chatState: { loggedIn: number } = $state({
    ...connection.info().initialState,
  });

  connection.setMessageHandler((message: WsMessage<string>) => {
    if (message.type === "message") {
      messages.push(message.payload);
    }
  });
  connection.addMessageHandler((message: WsMessage<{ loggedIn: number }>) => {
    if (message.type === "state_update") {
      console.log({ message });
      chatState = { ...message.payload };
    }
  });
  const disconnect = () => {
    connection.close();
    onClose();
  };

  let message = $state("");
  let messages: string[] = $state([]);
</script>

<div class="f r g_5 pd">
  <button class="small" onclick={disconnect}>❌</button>
  <h2>online: {chatState.loggedIn}</h2>
</div>
<form
  onsubmit={(e) => {
    e.preventDefault();
    connection.message(message);
    message = "";
  }}
>
  <input type="text" bind:value={message} />
  <button disabled={!message || message.length < 2}>Send</button>
</form>
<ul>
  {#each messages as m}
    <li>{m}</li>
  {/each}
</ul>

<style>
  input {
    padding: 0.5rem 1rem;
  }
</style>
