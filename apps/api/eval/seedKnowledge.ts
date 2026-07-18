import { PlainTextLoader } from "../src/modules/document/loaders/plain-text.loader";
import { KnowledgeIngestionUseCase } from "../src/modules/knowledge/knowledge.ingestion.usecase";
import fixtures from "./fixtures.json";

export async function seedKnowledge(ingestion: KnowledgeIngestionUseCase) {
  const loader = new PlainTextLoader();

  for (const fixture of fixtures) {
    const document = await loader.load({
      title: fixture.title,

      text: fixture.content,

      source: "fixtures",
    });

    await ingestion.execute(document);
  }
}
