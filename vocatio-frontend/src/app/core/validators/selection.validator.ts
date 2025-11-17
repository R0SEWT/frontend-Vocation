export function hasAtLeastOne(selections: string[]): boolean {
  if (!Array.isArray(selections)) {
    return false;
  }
  return selections.some((entry) => entry.trim().length > 0);
}
