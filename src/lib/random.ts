export function random(min: number, max: number, randomFunc = Math.random) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
