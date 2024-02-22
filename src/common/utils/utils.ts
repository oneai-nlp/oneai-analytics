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

export function toLowerKeys(obj: { [key: string]: {} }) {
  if (typeof obj === 'undefined') {
    return {};
  }
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {} as { [key: string]: {} });
}

export function percentageIncrease(previous: number, current: number): number {
  let percent;
  if (current !== 0) {
    if (previous !== 0) {
      percent = ((current - previous) / previous) * 100;
    } else {
      percent = current * 100;
    }
  } else {
    percent = -previous * 100;
  }

  return Math.floor(percent);
}

export const numberToFixed = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const customNumberToFixed = (num: number): number => {
  const str = Math.abs(num).toString();
  const [integer, _] = str.split('.');

  if (integer.length < 3) {
    return numberToFixed(parseFloat(num.toFixed(2)));
  } else if (integer.length < 4) {
    return numberToFixed(parseFloat(num.toFixed(1)));
  } else {
    return parseFloat(num.toFixed(0));
  }
};

export function getNumberDescription(numIn: number): string {
  const num = customNumberToFixed(numIn);
  const prefix = num < 0 ? '-' : '';

  // Enumerate num abbreviations
  let abbrev = ['k', 'm', 'b', 't'];

  let strResult: string = num.toString();
  let result: number = Math.abs(num);
  let decPlaces = strResult.length > 3 ? 1 : 2;

  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Go through the array backwards, so we do the largest first
  for (let i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    let size = Math.pow(10, (i + 1) * 3);

    // If the num is bigger or equal do the abbreviation
    if (size <= result) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      result = Math.round((result * decPlaces) / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if (result === 1000 && i < abbrev.length - 1) {
        result = 1;
        i++;
      }

      // Add the letter for the abbreviation
      strResult = result.toString() + abbrev[i];

      // We are done... stop
      break;
    }
  }

  return prefix + strResult;
}

export const objectToLowerCase = <T>(obj: Record<string, T>) => {
  const entries = Object.entries(obj);

  return Object.fromEntries(
    entries.map(([key, value]) => {
      return [key.toLowerCase(), value];
    })
  );
};

export const skillsArray = [
  'sentence',
  'entity',
  'enhance',
  'highlight',
  'keyword',
  'summarize',
  'emotion',
  'article-topic',
  'sentiment',
  'extract-html',
  'html-extract-text',
  'html-extract-article',
  'anonymize',
  'embedding',
  'clustering',
  'action-item',
  'business-entity',
  'sales-insight',
  'dialogue-segmentation',
  'name',
  'number',
  'find',
  'transcribe',
  'translate',
  'detect-language',
  'debug',
  'headline',
  'subheading',
  'skill-discovery',
  'whisper-transcription',
  'service-email-insight',
  'pdf-extract-text',
  'custom',
  'fact-check',
  'gpt',
  'classify',
  'collection-search',
  'coda-query-classifier',
  'social-toxicity',
  'content-curation',
  'subsentence',
  'bizgpt',
  'files-extract-text',
  'query-rewriter',
];
