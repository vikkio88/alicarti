<script lang="ts">
  import { onMount } from "svelte";
  import Main from "./components/Main.svelte";
  import { connection } from "./libs/ws";

  let isConnected = $state(false);
  const connect = () => {
    connection.open(() => (isConnected = true));
  };

  onMount(() => () => connection.close());
</script>

<main>
  <h1>Alicarti Web</h1>
  {#if isConnected}
    <Main onClose={() => (isConnected = false)} />
  {:else}
    <button onclick={connect}>Connect</button>
  {/if}
</main>

<style>
</style>
