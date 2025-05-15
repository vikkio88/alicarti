<script lang="ts">
  import type { ClientDTO } from "@alicarti/shared";
  import Icon from "../../shared/Icon.svelte";
  import RPSIcon from "./RpsIcon.svelte";

  type Props = {
    reversePlayersMap: Record<string, "one" | "two">;
    playersMap: Record<"one" | "two", string | undefined>;
    clients: ClientDTO[];
    selfId: string;
    isAdmin: boolean;
  };

  const { playersMap, clients, isAdmin, selfId, reversePlayersMap }: Props =
    $props();
  let adminId = $derived(playersMap.one);

  let isSpectator = (id: string) => reversePlayersMap[id] === undefined;
</script>

<h2>Clients</h2>
<ul>
  {#each clients as client}
    <li class:me={selfId === client.socketId}>
      {#if client.socketId === adminId}
        <Icon name="crown" />
      {/if}
      {client.name}
      {#if isSpectator(client.socketId)}
        <Icon name="eye" />
      {:else if reversePlayersMap[client.socketId] === "one"}
        <RPSIcon name="one" />
      {:else}
        <RPSIcon name="two" />
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
  }
  li {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.2rem;
  }
  .me {
    font-weight: bold;
  }
</style>
