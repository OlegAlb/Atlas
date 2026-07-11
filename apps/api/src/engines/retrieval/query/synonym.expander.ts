const SYNONYMS: Record<string, string[]> = {
  вернуть: ["возврат", "отказ"],

  оплатить: ["оплата", "платеж"],

  купить: ["покупка", "заказ"],

  доставка: ["доставить", "получить"],
};

export function expandQuery(words: string[]): string[] {
  return [
    ...new Set(words.flatMap((word) => [word, ...(SYNONYMS[word] ?? [])])),
  ];
}
