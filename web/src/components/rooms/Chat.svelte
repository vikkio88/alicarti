<script lang="ts">
  import type { ChatRoomState } from "@alicarti/shared/rooms/chat/config";
  import type { RoomProps } from "./props";
  let { room, self }: RoomProps<ChatRoomState> = $props();
</script>

<h1>Chat Room</h1>

{self.socketId}
