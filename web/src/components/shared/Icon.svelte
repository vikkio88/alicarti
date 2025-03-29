<script lang="ts">
  type Props = {
    name: "disconnect" | "exit";
  };
  let { name }: Props = $props();
</script>

<div class="icon">
  <img src={`/icons/${name}.svg`} alt={name} />
</div>

<style>
  img {
    width: 1.5rem;
  }

  .icon {
    color: white;
  }
</style>
