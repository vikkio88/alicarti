<script lang="ts">
  import { connection } from "../libs/ws";
  connection.replaceEventListener("message", (e) => messages.push(e.data));

  let message = $state("");
  let messages: string[] = $state([]);
</script>

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
