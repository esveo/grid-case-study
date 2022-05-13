export function range(from: number, to: number): number[] {
  const step = from < to ? 1 : -1;

  const numbers: number[] = [];
  for (let i = from; i !== to; i += step) {
    numbers.push(i);
  }

  return numbers;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const result = [day, month, year]
    .map(String)
    .map((x) => x.padStart(2, "0"))
    .join(" ");

  return result;
}
