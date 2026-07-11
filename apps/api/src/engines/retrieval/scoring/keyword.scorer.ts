import { normalizeText } from "../query/normalize";

export class KeywordScorer {
  score(queryWords: string[], title: string, content: string) {
    const titleWords = normalizeText(title);
    const contentWords = normalizeText(content);

    let score = 0;

    for (const word of queryWords) {
      if (titleWords.includes(word)) {
        score += 2;
      }

      if (contentWords.includes(word)) {
        score += 3;
      }
    }

    return score;
  }
}
