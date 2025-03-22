<script lang="ts">
  import type { WsMessage } from "@alicarti/shared";
  import type { EchoRoomState } from "@alicarti/shared/rooms/configs";
  import { connection } from "../../libs/ws";

  let state: EchoRoomState = $state({
    messages: [] as string[],
    clients: 0,
  });

  connection.addMessageHandler((message: WsMessage<any>) => {
    if (message.type !== "state_update") {
      return;
    }

    const newState = message.payload as EchoRoomState;
    state = newState;
  });
</script>

<h1>Echo Room</h1>
<h3>Clients: {state.clients}</h3>
