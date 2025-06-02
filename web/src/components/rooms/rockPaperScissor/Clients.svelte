<script lang="ts">
  import type { ClientDTO } from "@alicarti/shared";
  import Icon from "../../shared/Icon.svelte";
  import RPSIcon from "./RpsIcon.svelte";
  import { connection } from "../../../libs/ws";
  import type { AssignedRole } from "@alicarti/shared/rooms/rockpaperscissor/config";

  type RevMap = Record<string, "one" | "two">;
  type PMap = Record<"one" | "two", string | undefined>;

  type Props = {
    reversePlayersMap: RevMap;
    playersMap: PMap;
    clients: ClientDTO[];
    selfId: string;
    isAdmin: boolean;
    roomId: string;
  };

  const {
    playersMap,
    clients,
    isAdmin,
    selfId,
    reversePlayersMap,
    roomId,
  }: Props = $props();
  let adminId = $derived(playersMap.one);

  let isSpectator = (id: string) => reversePlayersMap[id] === undefined;

  const canChange = (client: ClientDTO, reversePlayersMap: RevMap) =>
    reversePlayersMap[client.socketId] !== "one";
  const change = (client: ClientDTO) => {
    const role = isSpectator(client.socketId) ? "two" : "spectator";
    connection.action(roomId, "assignRole", {
      clientId: client.socketId,
      role,
    } as AssignedRole);
  };
</script>

<article>
  <ul class="list border">
    {#each clients as client}
      <li class:me={selfId === client.socketId} class="brd">
        {#if isAdmin && canChange(client, reversePlayersMap)}
          <div>
            <button class="small small-round" onclick={() => change(client)}>
              {#if isSpectator(client.socketId)}
                <Icon name="gamepad" />
              {:else}
                <Icon name="eye" />
              {/if}
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
</article>

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
