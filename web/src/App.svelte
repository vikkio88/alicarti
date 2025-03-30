<script lang="ts">
  import { onMount } from "svelte";
  import Main from "./pages/Main.svelte";
  import { connection } from "./libs/ws";
  import { appState } from "./store/appState.svelte";
  import Nav from "./components/Nav.svelte";
  import Icon from "./components/shared/Icon.svelte";

  const connect = () => {
    connection.open(() => appState.connected(connection.info().connection!));
  };
  connection.onClose(() => appState.disconnected());

  let isConnected = $derived(Boolean(appState.socketId));

  onMount(() => () => connection.close());
</script>
<Nav />
{#if isConnected}
  <Main />
{:else}
  <div class="f1 f cc">
    <button onclick={connect}><Icon name="connect" /> </button>
  </div>
{/if}

<style>
</style>
