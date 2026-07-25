import { CreateKnowledgeDocumentDTO } from "../../api/knowledge/knowledge.dto";
import { DocumentLoader } from "../../infrastructure/loaders/document-loader";
import { DocumentParser } from "../../infrastructure/parsers/document-parser";
import { KnowledgeIngestionUseCase } from "./knowledge.ingestion.usecase";

export class KnowledgeCreateUseCase {
  constructor(
    private loader: DocumentLoader,
    private parser: DocumentParser,
    private ingestion: KnowledgeIngestionUseCase,
  ) {}

  async execute(dto: CreateKnowledgeDocumentDTO) {
    const source = await this.loader.load({
      title: dto.title,
      text: dto.content,
    });

    const document = await this.parser.parse(source);

    return this.ingestion.execute(document);
  }
}
