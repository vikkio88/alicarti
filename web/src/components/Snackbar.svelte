<script lang="ts">
  import { uiState } from "../store/ui.svelte";
</script>

<div class="snackbarx" class:show={uiState.snackbar}>
  {#if uiState.snackbar}
    {uiState.snackbar.message}
  {/if}
</div>

<style>
  .snackbarx {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
  }
  .show {
    visibility: visible;
    animation: fadein 0.3s;
  }

  @keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 30px;
      opacity: 1;
    }
  }

  @keyframes fadeout {
    from {
      bottom: 30px;
      opacity: 1;
    }
    to {
      bottom: 0;
      opacity: 0;
    }
  }
</style>
