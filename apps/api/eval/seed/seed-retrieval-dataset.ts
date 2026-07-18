import { KnowledgeIngestionUseCase } from "../../src/modules/knowledge/knowledge.ingestion.usecase";

import corpus from "../datasets/retrieval/corpus.json";
import { createTestDocument } from "./create-test-document";

export async function seedRetrievalDataset(
  ingestion: KnowledgeIngestionUseCase,
) {
  for (const item of corpus) {
    const document = createTestDocument({
      id: item.id,

      title: item.title,

      content: item.content,
    });

    await ingestion.execute(document);
  }
}
