<script lang="ts">
  import { onMount } from "svelte";
  import Main from "./pages/Main.svelte";
  import { ws } from "./store/wsState.svelte";
  import Nav from "./components/Nav.svelte";
  import Icon from "./components/shared/Icon.svelte";
  import Snackbar from "./components/Snackbar.svelte";
  onMount(() => () => ws.disconnect());
</script>

<Nav />
{#if ws.isConnected}
  <Main />
{:else}
  <main class="responsive middle-align center-align">
    <button onclick={() => ws.connect()}>
      <div class="tooltip">Connect</div>
      <Icon name="connect" />
    </button>
  </main>
{/if}
<Snackbar />
