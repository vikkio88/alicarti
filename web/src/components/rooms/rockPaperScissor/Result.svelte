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
  <div class="f1 f r spb pd g">
    <h3>{who}</h3>
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
  <h2>
    {score1}
    -
    {score2}
  </h2>
  <h3>{label2}</h3>
{/snippet}

<div class="fcc mg">
  {#if result}
    {#if result.moves}
      <article>
        <div class="f1 f c g">
          {#if isPlayer}
            {@render move("You", result.moves[self])}
            {@render move("Them", result.moves[other])}
          {:else if result.moves && !isPlayer}
            {@render move("Player 1", result.moves.one)}
            {@render move("Player 2", result.moves.two)}
          {/if}
        </div>
      </article>
    {/if}
    <div class="result">
      {#if result.draw}
        <h2 class="neutral">Draw</h2>
        Ì
      {:else if isPlayer}
        {#if result.winner === self}
          <h2 class="win">You Win</h2>
        {:else}
          <h2 class="lose">You Lose</h2>
        {/if}
      {:else}
        <!-- If not a player -->
        {#if result.winner === "one"}
          <h2 class="neutral">Player One Wins</h2>
        {:else}
          <h2 class="neutral">Player Two Wins</h2>
        {/if}
      {/if}
    </div>
  {/if}
  <div class="fcc">
    <article class="center-align">
      <h3>
        {scoreHeader}
      </h3>
      <div class="scores">
        {#if isPlayer}
          {@render total(score[self], score[self === "one" ? "two" : "one"])}
        {:else}
          {@render total(score.one, score.two, "Player 1", "Player 2")}
        {/if}
      </div>
      <h3>
        Draws: {score.draws}
      </h3>
    </article>
  </div>
</div>

<style>
  .result h2 {
    font-size: 3rem;
    margin: 2rem 0;
  }

  h2.neutral {
    color: var(--primary);
  }
  h2.win {
    color: var(--primary-container);
  }
  h2.lose {
    color: var(--error);
  }

  .scores {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    align-items: center;
  }

  .scores > h2,
  h3 {
    margin-block-start: 0;
  }
</style>
