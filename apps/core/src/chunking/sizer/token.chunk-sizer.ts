import { Tokenizer } from "../tokenizer/tokenizer.interface";
import { TextSizer } from "./text-sizer.interface";

export class TokenChunkSizer implements TextSizer {
  constructor(private readonly tokenizer: Tokenizer) {}

  count(text: string): number {
    return this.tokenizer.count(text);
  }
}
