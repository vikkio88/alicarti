<script lang="ts">
  import {
    type ChatRoomState,
    type SendMessagePayload,
  } from "@alicarti/shared/rooms/chat/config";
  import type { RoomProps } from "./props";
  import { connection } from "../../libs/ws";
  import type { StateUpdateMessage } from "@alicarti/shared";
  let { room, self, initialState }: RoomProps<ChatRoomState> = $props();
  let chatState = $state(initialState);
  let message = $state("");

  connection.addStateUpdater((message: StateUpdateMessage<ChatRoomState>) => {
    chatState = message.payload;
  });

  const sendMessage = (e: SubmitEvent) => {
    e.preventDefault();
    connection.action<SendMessagePayload>(room.id, "send_message", { message });
    message = "";
  };
</script>

<main class="responsive">
  <h1>Chat Room</h1>
  <h2>{room.id}</h2>
  <div class="chat">
    <ul>
      {#each chatState.messages as message}
        <li>
          <div class="author" class:me={message.author.id === self.socketId}>
            {#if room.admin === message.author.id}
              {"[admin]"}
            {/if}
            {message.author.name || message.author.id}
          </div>
          <div class="message">{message.message}</div>
        </li>
      {/each}
    </ul>
  </div>
  <form onsubmit={sendMessage}>
    <div class="field border">
      <input type="text" placeholder="Message..." bind:value={message} />
    </div>
  </form>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  .chat {
    flex: 8;
    padding: 2rem;
    background-color: var(--background);
  }

  .me {
    font-weight: bold;
  }
  form {
    flex: 1;
  }
  form input {
    width: 100%;
    flex: 1;
  }
</style>
