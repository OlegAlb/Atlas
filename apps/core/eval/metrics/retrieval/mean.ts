export function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
