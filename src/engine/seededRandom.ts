// Mulberry32 - fast seeded PRNG for deterministic market replay
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed | 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns a random number between min and max */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Returns a random integer between min (inclusive) and max (exclusive) */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max));
  }

  /** Returns true with the given probability (0-1) */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /** Picks a random element from an array */
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length)];
  }
}
