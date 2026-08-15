// Generador pseudoaleatorio determinista (mulberry32) — misma semilla produce siempre el mismo dataset.
// Esto permite que el prototipo sea reproducible entre recargas y coherente entre pantallas.

export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

export class Rng {
  private rand: () => number;
  constructor(seed: number | string) {
    this.rand = mulberry32(typeof seed === 'string' ? hashSeed(seed) : seed);
  }
  next(): number {
    return this.rand();
  }
  float(min: number, max: number): number {
    return min + this.rand() * (max - min);
  }
  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }
  bool(pTrue = 0.5): boolean {
    return this.rand() < pTrue;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
  weighted<T>(items: { value: T; weight: number }[]): T {
    const total = items.reduce((s, i) => s + i.weight, 0);
    let r = this.rand() * total;
    for (const it of items) {
      if (r < it.weight) return it.value;
      r -= it.weight;
    }
    return items[items.length - 1].value;
  }
  gauss(mean: number, stdDev: number): number {
    const u1 = Math.max(this.rand(), 1e-9);
    const u2 = this.rand();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }
}
