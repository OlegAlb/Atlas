import { STOP_WORDS } from "../../query/stopwords";

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.has(word));
}

export function countTerms(words: string[]) {
  return words.reduce(
    (acc, word) => {
      acc[word] = (acc[word] ?? 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );
}
