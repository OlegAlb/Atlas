import { KnowledgeIngestionUseCase } from "../src/modules/knowledge/knowledge.ingestion.usecase";
import fixtures from "./fixtures.json";

export async function seedKnowledge(
  knowledgeIngestionUseCase: KnowledgeIngestionUseCase,
) {
  for (const fixture of fixtures) {
    await knowledgeIngestionUseCase.execute({
      title: fixture.title,
      content: fixture.content,
    });
  }
}
