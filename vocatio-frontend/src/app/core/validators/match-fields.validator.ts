export function fieldsMatch(value: string, comparison: string): boolean {
  return Boolean(value && comparison && value === comparison);
}
