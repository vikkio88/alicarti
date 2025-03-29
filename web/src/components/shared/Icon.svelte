<script lang="ts">
  import { DoorOpenSolid, PlugCircleXmarkSolid } from "svelte-awesome-icons";
  type Props = {
    name: "disconnect" | "exit";
    size?: "18" | "24" | "32";
  };
  const map = {
    disconnect: PlugCircleXmarkSolid,
    exit: DoorOpenSolid,
  };
  let { name, size = "18" }: Props = $props();
  let Ico = map[name];
</script>

<Ico {size} />
