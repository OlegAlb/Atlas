import { Tokenizer } from "./tokenizer.interface";

export class CharacterTokenizer implements Tokenizer {
  count(text: string) {
    return text.length;
  }
}
