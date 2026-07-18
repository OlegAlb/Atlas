import { Tokenizer } from "./tokenizer.interface";

export class WordTokenizer implements Tokenizer {
  count(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
}
