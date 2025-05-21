<script lang="ts">
  import type { ClientDTO } from "@alicarti/shared";
  import Icon from "../../shared/Icon.svelte";
  import RPSIcon from "./RpsIcon.svelte";

  type RevMap = Record<string, "one" | "two">;
  type PMap = Record<"one" | "two", string | undefined>;

  type Props = {
    reversePlayersMap: RevMap;
    playersMap: PMap;
    clients: ClientDTO[];
    selfId: string;
    isAdmin: boolean;
  };

  const { playersMap, clients, isAdmin, selfId, reversePlayersMap }: Props =
    $props();
  let adminId = $derived(playersMap.one);

  let isSpectator = (id: string) => reversePlayersMap[id] === undefined;

  const canChange = (client: ClientDTO, reversePlayersMap: RevMap) =>
    reversePlayersMap[client.socketId] !== "one";
  const change = (client: ClientDTO) => console.log(client);
  const changeAction = (client: ClientDTO) =>
    isSpectator(client.socketId) ? "Player" : "Spectator";
</script>

<ul>
  {#each clients as client}
    <li class:me={selfId === client.socketId} class="brd">
      {#if isAdmin && canChange(client, reversePlayersMap)}
        <div>
          <button class="small transparent" onclick={() => change(client)}>
            {changeAction(client)}
          </button>
        </div>
      {/if}
      {client.name}
      <div>
        {#if client.socketId === adminId}
          <Icon name="crown" />
        {/if}
        {#if isSpectator(client.socketId)}
          <Icon name="eye" />
        {:else if reversePlayersMap[client.socketId] === "one"}
          <RPSIcon name="one" />
        {:else}
          <RPSIcon name="two" />
        {/if}
      </div>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  li {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
  }
  .me {
    font-weight: bold;
  }
</style>
