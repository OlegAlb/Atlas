import regressionCorpus from "../retrieval/normal/corpus.json";
import hardCorpus from "../retrieval/hard/corpus.json";

export function getRetrievalCorpus(name: string) {
  switch (name) {
    case "regression":
      return regressionCorpus;

    case "hard":
      return hardCorpus;

    default:
      throw new Error(`Unknown dataset: ${name}`);
  }
}
