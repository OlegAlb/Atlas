import { encoding_for_model } from "tiktoken";
import { Tokenizer } from "./tokenizer.interface";

export class GPTTokenizer implements Tokenizer {
  private readonly encoder = encoding_for_model("text-embedding-3-small");

  count(text: string): number {
    return this.encoder.encode(text).length;
  }

  dispose() {
    this.encoder.free();
  }
}
