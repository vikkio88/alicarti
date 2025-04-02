export class Randomizer {
  private seed: number;

  constructor(seed: number = 1) {
    this.seed = seed;
  }

  resetSeed() {
    this.setSeed(1);
  }

  setRandomSeed() {
    this.setSeed(Date.now());
  }

  setSeed(seed: number) {
    this.seed = seed;
  }

  random(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  pickOne<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  pickSome<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => this.int(-1, 1));
    return shuffled.slice(0, count);
  }

  int(low: number, high: number): number {
    return Math.floor(this.random() * (high - low + 1)) + low;
  }

  perc(low = 0, high = 100): number {
    return this.int(low, high) / 100.0;
  }

  chance(percentage: number): boolean {
    return this.int(0, 99) < percentage;
  }

  norm(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}
