<script lang="ts">
  import { onMount } from "svelte";
  import ChatForm from "./components/ChatForm.svelte";
  import { connection } from "./libs/ws";

  const connect = () => {
    connection.open();
    isConnected = true;
  };
  let isConnected = $state(false);

  onMount(() => () => connection.close());
</script>

<main>
  <h1>Alicarti Web</h1>
  {#if isConnected}
    <ChatForm />
  {:else}
    <button onclick={connect}>Connect</button>
  {/if}
</main>

<style>
</style>
