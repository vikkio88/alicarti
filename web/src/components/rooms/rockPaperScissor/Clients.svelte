<script lang="ts">
  import type { ClientDTO } from "@alicarti/shared";

  type Props = {
    playersMap: Record<string, "one" | "two">;
    clients: ClientDTO[];
    isAdmin: boolean;
  };

  const { playersMap, clients, isAdmin }: Props = $props();
</script>
