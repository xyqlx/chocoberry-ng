export function squeezeMetric(
  data: [Date, number][],
  threshold: number
): [Date, number][] {
  const result: [Date, number][] = [];
  let last: [Date, number] | undefined;
  for (const item of data) {
    // if two values are too close, skip
    if (last && Math.abs(last[1] - item[1]) <= threshold) {
      continue;
    }
    result.push(item);
    last = item;
  }
  // add last value of data
  if (last !== data[data.length - 1]) {
    result.push(data[data.length - 1]);
  }
  return result;
}
