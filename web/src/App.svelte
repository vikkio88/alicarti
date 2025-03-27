<script lang="ts">
  import { onMount } from "svelte";
  import Main from "./pages/Main.svelte";
  import { connection } from "./libs/ws";

  let isConnected = $state(false);
  const connect = () => {
    connection.open(() => (isConnected = true));
  };
  connection.onClose(() => (isConnected = false));

  onMount(() => () => connection.close());
</script>

<main>
  {#if isConnected}
    <Main onClose={() => (isConnected = false)} />
  {:else}
    <div class="f1 f cc">
      <button onclick={connect}>Connect</button>
    </div>
  {/if}
</main>

<style>
</style>
