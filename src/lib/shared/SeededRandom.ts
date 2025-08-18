/**
 * Seeded random number generator using Linear Congruential Generator (LCG)
 * Ensures deterministic random values based on seed
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    // Convert string seed to number if needed
    if (typeof seed === "string") {
      this.seed = 0;
      for (let i = 0; i < seed.length; i++) {
        this.seed = (this.seed << 5) - this.seed + seed.charCodeAt(i);
        this.seed = this.seed & this.seed; // Convert to 32-bit integer
      }
    } else {
      this.seed = seed;
    }
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    // LCG parameters (from Numerical Recipes)
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Generate random number between min and max
   */
  between(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  intBetween(min: number, max: number): number {
    return Math.floor(this.between(min, max + 1));
  }

  /**
   * Random chance (returns true with given probability)
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.intBetween(0, array.length - 1)];
  }

  /**
   * Shuffle array (returns new array)
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.intBetween(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
