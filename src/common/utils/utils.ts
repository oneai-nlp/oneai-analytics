export function calculateFontSize(height: number, width: number) {
  const area = height * width;
  let fontSize = 10 + (32 * area) / (250000 - 15000);
  fontSize = Math.max(fontSize, 10);
  fontSize = Math.min(fontSize, 60);
  return fontSize;
}

export function groupBy<T, K extends keyof any>(
  arr: T[],
  key: (i: T) => K
): Map<K, T[]> {
  const map: Map<K, T[]> = new Map();
  arr.forEach((item) => {
    const currentKey = key(item);
    const savedCluster = map.get(currentKey) || [];
    savedCluster.push(item);
    map.set(currentKey, savedCluster);
  });

  return map;
}

export function chunks<T>(arr: T[], size: number): Array<T[]> {
  return Array.from(new Array(Math.ceil(arr.length / size)), (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export function getSecondsDiff(startDate: Date, endDate: Date) {
  const diff = endDate.getTime() - startDate.getTime();

  return Math.abs(diff / 1000);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((partialSum, a) => partialSum + a, 0);
}

export function uniqBy<T, K>(arr: T[], getKey: (item: T) => K) {
  let seen = new Set<K>();
  return arr.filter((item) => {
    let k = getKey(item);
    return seen.has(k) ? false : seen.add(k);
  });
}
