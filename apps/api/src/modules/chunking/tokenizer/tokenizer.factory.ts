import { CharacterTokenizer } from "./character.tokenizer";
import { GPTTokenizer } from "./gpt.tokenizer";
import { Tokenizer } from "./tokenizer.interface";

export enum TokenizerType {
  Character,
  GPT,
}

export function createTokenizer(type: TokenizerType): Tokenizer {
  switch (type) {
    case TokenizerType.GPT:
      return new GPTTokenizer();

    default:
      return new CharacterTokenizer();
  }
}
