<script lang="ts">
  import type {
    Score,
    RoundResult,
    Phase,
    Move,
  } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import RPSIcon from "./MoveIcon.svelte";

  type Props = {
    isPlayer: boolean;
    score: Score;
    self: "one" | "two";
    phase: Phase;
    result?: RoundResult;
  };

  let { result, score, self, phase, isPlayer }: Props = $props();
  let other: "one" | "two" = self === "one" ? "two" : "one";
  let scoreHeader = $derived(phase === "over" ? "Final Score" : "Score");
</script>

{#snippet move(who: string, move: Move)}
  <div class="f1 f c">
    <h2>{who}</h2>
    <RPSIcon size="48" {move} />
  </div>
{/snippet}

{#snippet total(
  score1: number,
  score2: number,
  label1 = "You",
  label2 = "Them"
)}
  <h3>{label1}</h3>
  <h3>
    {score1}
    -
    {score2}
  </h3>
  <h3>{label2}</h3>
{/snippet}

<div class="f cc mg">
  {#if result}
    {#if result.moves}
      <div class="f rc mg g">
        {#if isPlayer}
          {@render move("You", result.moves[self])}
          {@render move("Them", result.moves[other])}
        {:else if result.moves && !isPlayer}
          {@render move("Player 1", result.moves.one)}
          {@render move("Player 2", result.moves.two)}
        {/if}
      </div>
    {/if}
    <div class="result">
      {#if result.draw}
        <h2>Draw</h2>
      {:else if isPlayer}
        {#if result.winner === self}
          <h2>You Win</h2>
        {:else}
          <h2>You Lose</h2>
        {/if}
      {:else}
        <!-- If not a player -->
        {#if result.winner === "one"}
          <h2>Player One Wins</h2>
        {:else}
          <h2>Player Two Wins</h2>
        {/if}
      {/if}
    </div>
  {/if}
  <div class="f cc">
    <h1>
      {scoreHeader}
    </h1>
    <div class="f rc g">
      {#if isPlayer}
        {@render total(score[self], score[self === "one" ? "two" : "one"])}
      {:else}
        {@render total(score.one, score.two, "Player 1", "Player 2")}
      {/if}
    </div>
    <h3>
      Draws: {score.draws}
    </h3>
  </div>
</div>

<style>
  .result h2 {
    font-size: 3rem;
    margin: 2rem 0;
  }
</style>
