import { KnowledgeIngestionUseCase } from "../../src/application/knowledge/knowledge.ingestion.usecase";

import { createTestDocument } from "./create-test-document";

export interface RetrievalCorpusDocument {
  id: string;
  title: string;
  content: string;
}

export async function seedRetrievalDataset(
  ingestion: KnowledgeIngestionUseCase,
  corpus: RetrievalCorpusDocument[],
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
